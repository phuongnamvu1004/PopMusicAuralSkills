from __future__ import annotations

import re

from ..core.models import ExerciseLine
from .scale_degrees import is_scale_degree_answer, normalize_scale_degree_answer


PARENTHESIZED_SCALE_DEGREE_RE = re.compile(r"^\((?:b|#|♭|♯)?[1-7]\)$")


def find_body_items(items: list[str]) -> list[str]:
    for index in range(len(items)):
        if read_answer(items, index):
            return items[index:]

    return []


def parse_body(
    items: list[str],
    warnings: list[str],
) -> tuple[list[ExerciseLine], dict[str, list[str]], dict[str, str]]:
    lines: list[ExerciseLine] = []
    answers_by_line: dict[str, list[str]] = {}
    answers_by_id: dict[str, str] = {}

    index = 0
    while index < len(items):
        if not read_answer(items, index):
            warnings.append(f"Skipped non-answer token while looking for answer row: {items[index]!r}")
            index += 1
            continue

        answers: list[str] = []
        while index < len(items):
            parsed_answer = read_answer(items, index)
            if not parsed_answer:
                break
            answer, next_index = parsed_answer
            answers.append(answer)
            index = next_index

        lyric_tokens: list[str] = []
        while index < len(items) and not read_answer(items, index):
            lyric_tokens.append(items[index])
            index += 1

        if not lyric_tokens:
            warnings.append(f"Skipped answer row with no lyric tokens: {answers!r}")
            continue

        line_id = f"L{len(lines) + 1}"
        blank_ids = [f"{line_id}_B{blank_index}" for blank_index in range(1, len(answers) + 1)]

        lines.append(ExerciseLine(lineId=line_id, blanks=blank_ids, lyric=" ".join(lyric_tokens)))
        answers_by_line[line_id] = answers
        answers_by_id.update(dict(zip(blank_ids, answers, strict=True)))

    if not lines:
        raise ValueError("No exercise lines were parsed from the PDF body.")

    return lines, answers_by_line, answers_by_id


def read_answer(items: list[str], index: int) -> tuple[str, int] | None:
    item = items[index]
    if _is_parenthesized_scale_degree(item) and index + 1 < len(items) and is_scale_degree_answer(items[index + 1]):
        return normalize_scale_degree_answer(f"{item} {items[index + 1]}"), index + 2

    if is_scale_degree_answer(item):
        return normalize_scale_degree_answer(item), index + 1

    return None


def _is_parenthesized_scale_degree(item: str) -> bool:
    return bool(PARENTHESIZED_SCALE_DEGREE_RE.fullmatch(normalize_scale_degree_answer(item)))
