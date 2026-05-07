from __future__ import annotations

import re
import zlib
from pathlib import Path


STREAM_RE = re.compile(rb"<<(.*?)>>\s*stream\r?\n(.*?)\r?\nendstream", re.S)
HEX_TEXT_RE = re.compile(rb"<([0-9A-Fa-f]+)>\s*Tj")
BFCHAR_RE = re.compile(r"<([0-9A-Fa-f]{4})>\s*<([0-9A-Fa-f]{4})>")


def extract_text_items(pdf_path: Path) -> list[str]:
    """Extract ordered text items from a Google Docs-rendered tagged PDF.

    This fallback parser exists so the importer can run without native PDF
    dependencies. It handles the current Google Docs PDF shape used for the
    exercise documents. If future PDFs vary more, replace this extractor with
    pdfplumber or PyMuPDF behind the same list[str] boundary.
    """

    pdf_bytes = pdf_path.read_bytes()
    streams = _flate_streams(pdf_bytes)
    cmap = _build_unicode_map(streams)

    items: list[str] = []
    for stream in streams:
        if b"/MCID" not in stream:
            continue

        for block in re.split(rb"EMC", stream):
            text = "".join(_decode_hex_text(match, cmap) for match in HEX_TEXT_RE.findall(block)).strip()
            if text:
                items.append(text)

    return items


def _flate_streams(pdf_bytes: bytes) -> list[bytes]:
    streams: list[bytes] = []
    for match in STREAM_RE.finditer(pdf_bytes):
        header = match.group(1)
        data = match.group(2)
        if b"FlateDecode" not in header:
            continue

        try:
            streams.append(zlib.decompress(data))
        except zlib.error:
            continue

    return streams


def _build_unicode_map(streams: list[bytes]) -> dict[int, str]:
    unicode_map: dict[int, str] = {}

    for stream in streams:
        if b"beginbfchar" not in stream and b"beginbfrange" not in stream:
            continue

        text = stream.decode("latin1", errors="ignore")
        for source, target in BFCHAR_RE.findall(text):
            unicode_map[int(source, 16)] = chr(int(target, 16))

        in_range = False
        for line in text.splitlines():
            if "beginbfrange" in line:
                in_range = True
                continue
            if "endbfrange" in line:
                in_range = False
                continue
            if not in_range:
                continue

            values = re.findall(r"<([0-9A-Fa-f]{4})>", line)
            if len(values) != 3:
                continue

            start, end, target = (int(value, 16) for value in values)
            for codepoint in range(start, end + 1):
                unicode_map[codepoint] = chr(target + codepoint - start)

    return unicode_map


def _decode_hex_text(hex_text: bytes, unicode_map: dict[int, str]) -> str:
    raw = bytes.fromhex(hex_text.decode("ascii"))
    chars: list[str] = []

    for index in range(0, len(raw), 2):
        codepoint = int.from_bytes(raw[index : index + 2], "big")
        chars.append(unicode_map.get(codepoint, "?"))

    return "".join(chars)

