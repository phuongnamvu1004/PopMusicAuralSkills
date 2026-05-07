from __future__ import annotations

import unittest
from pathlib import Path

from ..parsing.body import parse_body
from ..parsing.header import first_cue, first_key, parse_pdf_filename


class ParserTest(unittest.TestCase):
    def test_parse_pdf_filename_extracts_level_title_and_artist(self) -> None:
        parsed = parse_pdf_filename(Path("KEY_ 4A_ Come In With the Rain – Taylor Swift.pdf"))

        self.assertEqual(parsed["level"], "4A")
        self.assertEqual(parsed["title"], "Come In With the Rain")
        self.assertEqual(parsed["artist"], "Taylor Swift")

    def test_parse_body_pairs_answer_rows_with_lyric_rows(self) -> None:
        warnings: list[str] = []
        lines, answers_by_line, answers_by_id = parse_body(
            [
                "3",
                "4",
                "5",
                "I",
                "COULD",
                "GO",
                "2",
                "7",
                "BACK",
                "(cont.)",
            ],
            warnings,
        )

        self.assertEqual(warnings, [])
        self.assertEqual(lines[0].lineId, "L1")
        self.assertEqual(lines[0].blanks, ["L1_B1", "L1_B2", "L1_B3"])
        self.assertEqual(lines[0].lyric, "I COULD GO")
        self.assertEqual(lines[1].lineId, "L2")
        self.assertEqual(lines[1].blanks, ["L2_B1", "L2_B2"])
        self.assertEqual(lines[1].lyric, "BACK (cont.)")
        self.assertEqual(answers_by_line, {"L1": ["3", "4", "5"], "L2": ["2", "7"]})
        self.assertEqual(
            answers_by_id,
            {
                "L1_B1": "3",
                "L1_B2": "4",
                "L1_B3": "5",
                "L2_B1": "2",
                "L2_B2": "7",
            },
        )

    def test_parse_body_accepts_chromatic_and_ornamented_scale_degrees(self) -> None:
        warnings: list[str] = []
        lines, answers_by_line, answers_by_id = parse_body(
            [
                "7",
                "6",
                "5",
                "b7",
                "6",
                "OLD",
                "OAK",
                "TREE",
                "LONG",
                "TIME",
                "(6) 5",
                "#4",
                "5",
                "YEARS",
                "AGO",
                "NOW",
            ],
            warnings,
        )

        self.assertEqual(warnings, [])
        self.assertEqual(lines[0].lyric, "OLD OAK TREE LONG TIME")
        self.assertEqual(lines[1].lyric, "YEARS AGO NOW")
        self.assertEqual(answers_by_line["L1"], ["7", "6", "5", "b7", "6"])
        self.assertEqual(answers_by_line["L2"], ["(6) 5", "#4", "5"])
        self.assertEqual(answers_by_id["L1_B4"], "b7")
        self.assertEqual(answers_by_id["L2_B1"], "(6) 5")
        self.assertEqual(answers_by_id["L2_B2"], "#4")

    def test_parse_body_combines_split_ornamented_scale_degree_tokens(self) -> None:
        warnings: list[str] = []
        lines, answers_by_line, _answers_by_id = parse_body(
            ["(6)", "5", "6", "YEARS", "DO"],
            warnings,
        )

        self.assertEqual(warnings, [])
        self.assertEqual(lines[0].lyric, "YEARS DO")
        self.assertEqual(answers_by_line["L1"], ["(6) 5", "6"])

    def test_header_helpers_accept_pymupdf_word_tokens(self) -> None:
        items = ["Level", "5A:", "Chromatic", "Notes", "F", "Major", "(STILL", "WANT", "ME…", "START", "AT", "0:39)"]

        self.assertEqual(first_key(items), "F Major")
        self.assertEqual(first_cue(items), "(STILL WANT ME… START AT 0:39)")


if __name__ == "__main__":
    unittest.main()
