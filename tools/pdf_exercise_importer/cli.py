from __future__ import annotations

import argparse
import json
from pathlib import Path

from .output.contentful_payload import parsed_exercise_to_dict
from .parsing.parser import parse_pdf_exercise


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract an exercise PDF into Contentful-ready JSON.")
    parser.add_argument("--pdf", required=True, type=Path, help="Path to the source PDF.")
    parser.add_argument("--id", required=True, dest="exercise_id", help="Exercise id, e.g. ciwtr_4A.")
    parser.add_argument("--source", required=True, help="Source URL for exerciseMeta.source.")
    parser.add_argument("--title", help="Override exercise title.")
    parser.add_argument("--level", help="Override level, e.g. 4A.")
    parser.add_argument("--key", help="Override key, e.g. D Major.")
    parser.add_argument("--cue", help="Override cue text.")
    parser.add_argument("--chapter", type=int, dest="chapter_number", help="Override chapter number.")
    parser.add_argument("--section", dest="section_code", help="Override section code.")
    parser.add_argument("--section-key", dest="section_key", help="Override section key.")
    parser.add_argument("--out", type=Path, help="Write JSON to this path instead of stdout.")
    parser.add_argument("--include-raw-text", action="store_true", help="Include extracted raw text tokens.")
    parser.add_argument(
        "--extractor",
        choices=["auto", "pymupdf", "google-docs"],
        default="auto",
        help="PDF text extractor to use. Defaults to PyMuPDF with Google Docs fallback.",
    )

    args = parser.parse_args()
    pdf_path = args.pdf.expanduser()
    out_path = args.out.expanduser() if args.out else None

    parsed = parse_pdf_exercise(
        pdf_path,
        exercise_id=args.exercise_id,
        source=args.source,
        title=args.title,
        level=args.level,
        key=args.key,
        cue=args.cue,
        chapter_number=args.chapter_number,
        section_code=args.section_code,
        section_key=args.section_key,
        extractor=args.extractor,
    )

    payload = parsed_exercise_to_dict(parsed)
    if not args.include_raw_text:
        payload.pop("rawText", None)

    output = json.dumps(payload, indent=2, ensure_ascii=False)
    if out_path:
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(output + "\n", encoding="utf-8")
    else:
        print(output)


if __name__ == "__main__":
    main()
