from __future__ import annotations

import tempfile
import unittest
from unittest.mock import patch
from pathlib import Path

from ..core.models import Exercise, ExerciseKey, ExerciseLine, ExerciseMeta, ParsedExercise
from ..output.contentful_payload import parsed_exercise_to_dict
from ..output.config import load_contentful_config
from ..output.contentful_client import _localize_fields


class OutputTest(unittest.TestCase):
    def test_load_contentful_config_uses_dotenv_values(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".env"
            path.write_text(
                """
                # ignored
                CONTENTFUL_SPACE_ID="space"
                CONTENTFUL_ENVIRONMENT_ID=master
                CONTENTFUL_MANAGEMENT_TOKEN='secret'
                """,
                encoding="utf-8",
            )

            with patch.dict("os.environ", {}, clear=True):
                config = load_contentful_config(path)

        self.assertEqual(config.space_id, "space")
        self.assertEqual(config.environment_id, "master")
        self.assertEqual(config.management_token, "secret")
        self.assertEqual(config.locale, "en-US")

    def test_localize_fields_wraps_values_with_locale(self) -> None:
        fields = {
            "exerciseId": "ciwtr_4A",
            "answersByLine": {"L1": ["3"]},
            "meta": {"sys": {"type": "Link", "linkType": "Entry", "id": "ciwtr_4A_meta"}},
        }

        self.assertEqual(
            _localize_fields(fields, "en-US"),
            {
                "exerciseId": {"en-US": "ciwtr_4A"},
                "answersByLine": {"en-US": {"L1": ["3"]}},
                "meta": {"en-US": {"sys": {"type": "Link", "linkType": "Entry", "id": "ciwtr_4A_meta"}}},
            },
        )

    def test_contentful_payload_prefixes_exercise_title_with_chapter_section(self) -> None:
        parsed = ParsedExercise(
            exercise=Exercise(
                id="ciwtr_4A",
                title="Come In With the Rain",
                chapterNumber=4,
                sectionCode="A",
                sectionKey="4-a",
                lines=[ExerciseLine(lineId="L1", blanks=["L1_B1"], lyric="I")],
                renderStyle="underscores",
                blankBox={"width": 64, "height": 30, "gap": 10},
                metaEntryId="ciwtr_4A_meta",
                exerciseKeyEntryId="ciwtr_4A_key",
            ),
            exerciseMeta=ExerciseMeta(
                exerciseId="ciwtr_4A",
                source="https://example.com/source",
                level="4A",
                key="D Major",
                cue="Cue",
            ),
            exerciseKey=ExerciseKey(
                exerciseId="ciwtr_4A",
                answersByLine={"L1": ["3"]},
                answersById={"L1_B1": "3"},
                grading={"trim": True, "caseInsensitive": True, "allowedValues": ["3"]},
            ),
            rawText=[],
            warnings=[],
        )

        payload = parsed_exercise_to_dict(parsed)

        self.assertEqual(payload["contentfulEntries"]["exercises"]["fields"]["title"], "4A: Come In With the Rain")


if __name__ == "__main__":
    unittest.main()
