from __future__ import annotations

import argparse
import json
from pathlib import Path

from .output.config import load_contentful_config
from .output.contentful_client import ContentfulManagementClient
from .output.contentful_payload import parsed_exercise_to_dict
from .parsing.parser import parse_pdf_exercise


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract an exercise PDF into Contentful-ready JSON.")
    parser.add_argument("--pdf", type=Path, help="Path to the source PDF.")
    parser.add_argument("--id", dest="exercise_id", help="Exercise id, e.g. ciwtr_4A.")
    parser.add_argument("--source", help="Source URL for exerciseMeta.source.")
    parser.add_argument("--title", help="Override exercise title.")
    parser.add_argument("--level", help="Override level, e.g. 4A.")
    parser.add_argument("--key", help="Override key, e.g. D Major.")
    parser.add_argument("--cue", help="Override cue text.")
    parser.add_argument("--chapter", type=int, dest="chapter_number", help="Override chapter number.")
    parser.add_argument("--section", dest="section_code", help="Override section code.")
    parser.add_argument("--section-key", dest="section_key", help="Override section key.")
    parser.add_argument("--out", type=Path, help="Write JSON to this path instead of stdout.")
    parser.add_argument("--include-raw-text", action="store_true", help="Include extracted raw text tokens.")
    parser.add_argument("--upload", action="store_true", help="Upload parsed entries to Contentful.")
    parser.add_argument("--publish", action="store_true", help="Publish uploaded Contentful entries.")
    parser.add_argument("--test-connection", action="store_true", help="Test Contentful credentials and exit.")
    parser.add_argument(
        "--update-existing",
        action="store_true",
        help="Update entries if they already exist. Without this flag, existing entries fail the upload.",
    )
    parser.add_argument(
        "--env-file",
        type=Path,
        default=Path("tools/pdf_exercise_importer/.env"),
        help="Path to importer env file for Contentful upload.",
    )
    parser.add_argument(
        "--extractor",
        choices=["auto", "pymupdf", "google-docs"],
        default="auto",
        help="PDF text extractor to use. Defaults to PyMuPDF with Google Docs fallback.",
    )

    args = parser.parse_args()
    if args.test_connection:
        client = ContentfulManagementClient(load_contentful_config(args.env_file.expanduser()))
        result = client.test_connection()
        print(f"Connected to Contentful space {result['space_id']} ({result['space_name']})")
        print(f"Environment {result['environment_id']} ({result['environment_name']}) is accessible")
        return

    if not args.exercise_id:
        parser.error("--id is required unless --test-connection is used.")
    if not args.source:
        parser.error("--source is required unless --test-connection is used.")
    if not args.pdf:
        parser.error("--pdf is required unless --test-connection is used.")

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

    if args.upload:
        client = ContentfulManagementClient(load_contentful_config(args.env_file.expanduser()))
        results = client.upsert_entries(
            payload["contentfulEntries"],
            update_existing=args.update_existing,
            publish=args.publish,
        )
        for result in results:
            status = f"{result.action} {result.content_type} {result.entry_id}"
            if result.published:
                status += " and published"
            print(status)


if __name__ == "__main__":
    main()
