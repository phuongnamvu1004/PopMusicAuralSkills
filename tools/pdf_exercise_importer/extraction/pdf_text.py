from __future__ import annotations

from pathlib import Path

from .google_docs_pdf import extract_text_items as extract_google_docs_text_items


ExtractorName = str


def extract_text_items(pdf_path: Path, extractor: ExtractorName = "auto") -> list[str]:
    if extractor not in {"auto", "pymupdf", "google-docs"}:
        raise ValueError(f"Unknown extractor {extractor!r}. Use auto, pymupdf, or google-docs.")

    if extractor in {"auto", "pymupdf"}:
        try:
            return _extract_with_pymupdf(pdf_path)
        except ModuleNotFoundError:
            if extractor == "pymupdf":
                raise RuntimeError("PyMuPDF is not installed. Run: python3 -m pip install -r tools/pdf_exercise_importer/requirements.txt")
        except Exception:
            if extractor == "pymupdf":
                raise

    return extract_google_docs_text_items(pdf_path)


def _extract_with_pymupdf(pdf_path: Path) -> list[str]:
    import fitz

    items: list[str] = []
    with fitz.open(pdf_path) as document:
        for page in document:
            words = page.get_text("words", sort=True)
            items.extend(word[4].strip() for word in words if word[4].strip())

    return items
