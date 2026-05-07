from __future__ import annotations

import re
from pathlib import Path


LEVEL_RE = re.compile(r"(?P<chapter>\d+)(?P<section>[A-Z])", re.I)
PDF_NAME_RE = re.compile(r"(?:KEY_?\s*)?(?P<level>\d+[A-Z])_?\s*(?P<title>.+?)(?:\s+[–-]\s+(?P<artist>.+))?$")
KEY_RE = re.compile(r"^[A-G](?:#|b)?\s+(?:Major|Minor)$", re.I)


def parse_pdf_filename(pdf_path: Path) -> dict[str, str]:
    name = pdf_path.stem.strip()
    match = PDF_NAME_RE.match(name)
    if not match:
        return {}

    return {key: value.strip() for key, value in match.groupdict(default="").items() if value}


def level_from_exercise_id(exercise_id: str) -> str:
    return exercise_id.split("_", 1)[1]


def parse_level(level: str) -> tuple[int, str]:
    match = LEVEL_RE.fullmatch(level.strip())
    if not match:
        raise ValueError(f"level must look like 4A: {level}")

    return int(match.group("chapter")), match.group("section").upper()


def first_key(items: list[str]) -> str | None:
    direct = _first_matching(items, KEY_RE)
    if direct:
        return direct

    for first, second in zip(items, items[1:], strict=False):
        candidate = f"{first} {second}".replace("?", "e").strip()
        if KEY_RE.match(candidate):
            return candidate

    return None


def first_cue(items: list[str]) -> str | None:
    for index, item in enumerate(items):
        if item.startswith("(") and item.endswith(")") and not is_continuation(item):
            return item
        if not item.startswith("(") or is_continuation(item):
            continue

        cue_tokens = [item]
        for next_item in items[index + 1 :]:
            cue_tokens.append(next_item)
            if next_item.endswith(")"):
                return " ".join(cue_tokens)

    return None


def is_continuation(item: str) -> bool:
    return item.strip().lower() == "(cont.)"


def _first_matching(items: list[str], pattern: re.Pattern[str]) -> str | None:
    for item in items:
        normalized = item.replace("?", "e").strip()
        if pattern.match(normalized):
            return normalized
    return None
