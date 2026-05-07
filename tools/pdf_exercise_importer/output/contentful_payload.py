from __future__ import annotations

from dataclasses import asdict

from ..core.models import ParsedExercise


def parsed_exercise_to_dict(parsed: ParsedExercise) -> dict[str, object]:
    data = asdict(parsed)
    data["contentfulEntries"] = {
        "exerciseMeta": {
            "entryId": parsed.exercise.metaEntryId,
            "contentType": "exerciseMeta",
            "fields": asdict(parsed.exerciseMeta),
        },
        "exerciseKey": {
            "entryId": parsed.exercise.exerciseKeyEntryId,
            "contentType": "exerciseKey",
            "fields": asdict(parsed.exerciseKey),
        },
        "exercises": {
            "entryId": parsed.exercise.id,
            "contentType": "exercises",
            "fields": {
                "id": parsed.exercise.id,
                "title": parsed.exercise.title,
                "chapterNumber": parsed.exercise.chapterNumber,
                "sectionCode": parsed.exercise.sectionCode,
                "sectionKey": parsed.exercise.sectionKey,
                "lines": [asdict(line) for line in parsed.exercise.lines],
                "renderStyle": parsed.exercise.renderStyle,
                "blankBox": parsed.exercise.blankBox,
                "meta": {"sys": {"type": "Link", "linkType": "Entry", "id": parsed.exercise.metaEntryId}},
                "exerciseKey": {"sys": {"type": "Link", "linkType": "Entry", "id": parsed.exercise.exerciseKeyEntryId}},
            },
        },
    }
    return data
