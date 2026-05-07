from __future__ import annotations

import re


ACCIDENTAL_RE = r"(?:b|#|♭|♯)?"
DEGREE_RE = r"[1-7]"
SCALE_DEGREE_RE = re.compile(rf"^{ACCIDENTAL_RE}{DEGREE_RE}$")
ORNAMENTED_SCALE_DEGREE_RE = re.compile(rf"^\({ACCIDENTAL_RE}{DEGREE_RE}\)\s+{ACCIDENTAL_RE}{DEGREE_RE}$")


def is_scale_degree_answer(value: str) -> bool:
    normalized = normalize_scale_degree_answer(value)
    return bool(SCALE_DEGREE_RE.fullmatch(normalized) or ORNAMENTED_SCALE_DEGREE_RE.fullmatch(normalized))


def normalize_scale_degree_answer(value: str) -> str:
    return " ".join(value.strip().replace("♭", "b").replace("♯", "#").split())


def sort_scale_degree_answers(values: list[str]) -> list[str]:
    return sorted(values, key=_sort_key)


def _sort_key(value: str) -> tuple[int, str]:
    normalized = normalize_scale_degree_answer(value)
    match = re.search(DEGREE_RE, normalized)
    degree = int(match.group(0)) if match else 99
    return degree, normalized
