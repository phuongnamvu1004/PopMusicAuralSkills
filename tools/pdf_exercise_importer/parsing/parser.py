from __future__ import annotations

import re
from pathlib import Path

from ..core.models import Exercise, ExerciseKey, ExerciseMeta, ParsedExercise
from ..extraction.pdf_text import extract_text_items
from .body import find_body_items, parse_body
from .header import first_cue, first_key, level_from_exercise_id, parse_level, parse_pdf_filename
from .scale_degrees import sort_scale_degree_answers


EXERCISE_ID_RE = re.compile(r"^[a-z]+_[0-9]+[A-Z]$", re.I)


def parse_pdf_exercise(
    pdf_path: Path,
    *,
    exercise_id: str,
    source: str,
    title: str | None = None,
    level: str | None = None,
    key: str | None = None,
    cue: str | None = None,
    chapter_number: int | None = None,
    section_code: str | None = None,
    section_key: str | None = None,
    extractor: str = "auto",
) -> ParsedExercise:
    if not EXERCISE_ID_RE.match(exercise_id):
        raise ValueError(f"exercise_id must match {EXERCISE_ID_RE.pattern}: {exercise_id}")

    raw_items = extract_text_items(pdf_path, extractor)
    warnings: list[str] = []

    filename_meta = parse_pdf_filename(pdf_path)
    resolved_level = level or filename_meta.get("level") or level_from_exercise_id(exercise_id)
    resolved_title = title or filename_meta.get("title") or exercise_id
    resolved_key = key or first_key(raw_items) or ""
    resolved_cue = cue or first_cue(raw_items) or ""

    if not resolved_key:
        warnings.append("Could not infer key from PDF text; pass --key to populate exerciseMeta.key.")
    if not resolved_cue:
        warnings.append("Could not infer cue from PDF text; pass --cue to populate exerciseMeta.cue.")

    chapter, section = parse_level(resolved_level)
    resolved_chapter = chapter_number or chapter
    resolved_section = section_code or section
    resolved_section_key = section_key or f"{resolved_chapter}-{resolved_section.lower()}"

    body_items = find_body_items(raw_items)
    lines, answers_by_line, answers_by_id = parse_body(body_items, warnings)

    meta_entry_id = f"{exercise_id}_meta"
    key_entry_id = f"{exercise_id}_key"

    exercise_meta = ExerciseMeta(
        exerciseId=exercise_id,
        source=source,
        level=resolved_level,
        key=resolved_key,
        cue=resolved_cue,
    )
    exercise_key = ExerciseKey(
        exerciseId=exercise_id,
        answersByLine=answers_by_line,
        answersById=answers_by_id,
        grading={
            "trim": True,
            "caseInsensitive": True,
            "allowedValues": sort_scale_degree_answers(list(set(answers_by_id.values()))),
        },
    )
    exercise = Exercise(
        id=exercise_id,
        title=resolved_title,
        chapterNumber=resolved_chapter,
        sectionCode=resolved_section,
        sectionKey=resolved_section_key,
        lines=lines,
        renderStyle="underscores",
        blankBox={"width": 64, "height": 30, "gap": 10},
        metaEntryId=meta_entry_id,
        exerciseKeyEntryId=key_entry_id,
    )

    return ParsedExercise(
        exercise=exercise,
        exerciseMeta=exercise_meta,
        exerciseKey=exercise_key,
        rawText=raw_items,
        warnings=warnings,
    )
