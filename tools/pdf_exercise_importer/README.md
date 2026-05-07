# PDF Exercise Importer

This tool extracts PopMusicAuralSkills exercise PDFs into JSON payloads that match the current Contentful schema snapshots in `frontend/src/lib/contentful/schemas`.

The first version is dry-run only: it parses a PDF and writes JSON. It does not create Contentful entries yet.

## Structure

- `cli.py`: command line entrypoint.
- `extraction/pdf_text.py`: chooses the PDF text extractor.
- `extraction/google_docs_pdf.py`: no-dependency fallback extractor for Google Docs-rendered PDFs.
- `parsing/header.py`: title, level, key, cue, and filename parsing.
- `parsing/body.py`: answer-row and lyric-row parsing.
- `parsing/scale_degrees.py`: scale-degree answer recognition and normalization.
- `parsing/parser.py`: high-level orchestration from PDF path to parsed exercise model.
- `output/contentful_payload.py`: converts parsed models into Contentful-ready JSON.
- `core/models.py`: dataclasses shared across the importer.
- `tests/test_parser.py`: unit tests for parser behavior.

## Install

PyMuPDF is the preferred extractor:

```bash
python3 -m pip install -r tools/pdf_exercise_importer/requirements.txt
```

If PyMuPDF is not installed, the CLI falls back to the older Google Docs PDF extractor.

## Run

From the repo root:

```bash
python3 -m tools.pdf_exercise_importer.cli \
  --pdf "/path/to/KEY_ 4A_ Come In With the Rain – Taylor Swift.pdf" \
  --id ciwtr_4A \
  --source "https://example.com/source" \
  --out tools/pdf_exercise_importer/tmp/ciwtr_4A.json
```

Use `--include-raw-text` when debugging extraction.

Extractor choices:

- `--extractor auto`: default; tries PyMuPDF, then falls back to `google-docs`.
- `--extractor pymupdf`: requires PyMuPDF and fails if it is unavailable.
- `--extractor google-docs`: forces the fallback extractor.

## Test

Run importer unit tests from the repo root:

```bash
python3 -m unittest tools.pdf_exercise_importer.tests.test_parser
```

Run a sample dry-run import with the preferred extractor:

```bash
python3 -m tools.pdf_exercise_importer.cli \
  --extractor auto \
  --pdf "~/Downloads/KEY_ 5A_ Tie A Yellow Ribbon Round the Ole Oak Tree – Dawn and Tony Orlando.pdf" \
  --id tayrrooot_5A \
  --source "https://example.com/source" \
  --out tools/pdf_exercise_importer/tmp/tayrrooot_5A.json
```

Run the same import while forcing the fallback extractor:

```bash
python3 -m tools.pdf_exercise_importer.cli \
  --extractor google-docs \
  --pdf "~/Downloads/KEY_ 4A_ Come In With the Rain – Taylor Swift.pdf" \
  --id ciwtr_4A \
  --source "https://example.com/source" \
  --out tools/pdf_exercise_importer/tmp/ciwtr_4A.json
```

When frontend behavior changes, also run:

```bash
cd frontend
npm run build
```

## Contentful Upload Credentials

Parsing does not require Contentful credentials.

Uploading entries later will require:

- `CONTENTFUL_MANAGEMENT_TOKEN`: Contentful Management API token with write access.
- `CONTENTFUL_SPACE_ID`: your Contentful space id.
- `CONTENTFUL_ENVIRONMENT_ID`: usually `master` unless you use another environment.
- `CONTENTFUL_LOCALE`: usually `en-US`.

Copy the example file and fill in the token locally:

```bash
cp tools/pdf_exercise_importer/.env.example tools/pdf_exercise_importer/.env
```

`tools/pdf_exercise_importer/.env` and generated JSON under `tools/pdf_exercise_importer/tmp/` are ignored by git. Those values should stay outside the frontend and should not be committed.

## Notes

The parser intentionally separates PDF text extraction from exercise interpretation. PyMuPDF handles the general PDF text extraction. The domain parser still maps this specific exercise format into `exerciseMeta`, `exercises`, and `exerciseKey`.

The standard-library Google Docs extractor remains as a fallback for the current Google Docs-rendered PDFs.
