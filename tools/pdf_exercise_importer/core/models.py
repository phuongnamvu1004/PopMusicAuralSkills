from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ExerciseMeta:
    exerciseId: str
    source: str
    level: str
    key: str
    cue: str


@dataclass(frozen=True)
class ExerciseLine:
    lineId: str
    blanks: list[str]
    lyric: str


@dataclass(frozen=True)
class ExerciseKey:
    exerciseId: str
    answersByLine: dict[str, list[str]]
    answersById: dict[str, str]
    grading: dict[str, object]


@dataclass(frozen=True)
class Exercise:
    id: str
    title: str
    chapterNumber: int
    sectionCode: str
    sectionKey: str
    lines: list[ExerciseLine]
    renderStyle: str
    blankBox: dict[str, int]
    metaEntryId: str
    exerciseKeyEntryId: str


@dataclass(frozen=True)
class ParsedExercise:
    exercise: Exercise
    exerciseMeta: ExerciseMeta
    exerciseKey: ExerciseKey
    rawText: list[str]
    warnings: list[str]

