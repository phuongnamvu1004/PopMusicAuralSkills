from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


@dataclass(frozen=True)
class ContentfulConfig:
    space_id: str
    environment_id: str
    management_token: str
    locale: str = "en-US"


def load_contentful_config(env_file: Path) -> ContentfulConfig:
    load_dotenv(env_file, override=False)

    return ContentfulConfig(
        space_id=_required_env("CONTENTFUL_SPACE_ID"),
        environment_id=_required_env("CONTENTFUL_ENVIRONMENT_ID"),
        management_token=_required_env("CONTENTFUL_MANAGEMENT_TOKEN"),
        locale=os.environ.get("CONTENTFUL_LOCALE", "en-US"),
    )


def _required_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing {name}. Set it in your shell or tools/pdf_exercise_importer/.env.")
    return value
