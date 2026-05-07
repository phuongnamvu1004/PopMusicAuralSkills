from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from .config import ContentfulConfig


CONTENTFUL_CMA_BASE_URL = "https://api.contentful.com"
CONTENT_TYPE_BY_PAYLOAD_KEY = {
    "exerciseMeta": "exerciseMeta",
    "exerciseKey": "exerciseKey",
    "exercises": "exercises",
}


@dataclass(frozen=True)
class UploadResult:
    entry_id: str
    content_type: str
    action: str
    published: bool


class ContentfulManagementClient:
    def __init__(self, config: ContentfulConfig):
        self.config = config

    def test_connection(self) -> dict[str, str]:
        space = self._request("GET", f"/spaces/{self.config.space_id}")
        environment = self._request(
            "GET",
            f"/spaces/{self.config.space_id}/environments/{self.config.environment_id}",
        )

        return {
            "space_id": str(space["sys"]["id"]),
            "space_name": str(space.get("name", "")),
            "environment_id": str(environment["sys"]["id"]),
            "environment_name": str(environment.get("name", "")),
        }

    def upsert_entries(
        self,
        contentful_entries: dict[str, dict[str, Any]],
        *,
        update_existing: bool = False,
        publish: bool = False,
    ) -> list[UploadResult]:
        results: list[UploadResult] = []

        for payload_key in ("exerciseMeta", "exerciseKey", "exercises"):
            entry_payload = contentful_entries[payload_key]
            entry_id = str(entry_payload["entryId"])
            content_type = str(entry_payload.get("contentType") or CONTENT_TYPE_BY_PAYLOAD_KEY[payload_key])
            fields = entry_payload["fields"]

            existing = self.get_entry(entry_id)
            if existing and not update_existing:
                raise RuntimeError(
                    f"Entry {entry_id!r} already exists. Re-run with --update-existing to overwrite it.",
                )

            entry = self.create_or_update_entry(
                entry_id=entry_id,
                content_type=content_type,
                fields=fields,
                version=existing["sys"]["version"] if existing else None,
            )
            action = "updated" if existing else "created"

            published = False
            if publish:
                entry = self.publish_entry(entry_id, int(entry["sys"]["version"]))
                published = True

            results.append(
                UploadResult(
                    entry_id=entry_id,
                    content_type=content_type,
                    action=action,
                    published=published,
                ),
            )

        return results

    def get_entry(self, entry_id: str) -> dict[str, Any] | None:
        try:
            return self._request("GET", self._entry_path(entry_id))
        except HTTPError as error:
            if error.code == 404:
                return None
            raise

    def create_or_update_entry(
        self,
        *,
        entry_id: str,
        content_type: str,
        fields: dict[str, Any],
        version: int | None,
    ) -> dict[str, Any]:
        headers = {"X-Contentful-Content-Type": content_type}
        if version is not None:
            headers["X-Contentful-Version"] = str(version)

        body = {"fields": _localize_fields(fields, self.config.locale)}
        return self._request("PUT", self._entry_path(entry_id), body=body, headers=headers)

    def publish_entry(self, entry_id: str, version: int) -> dict[str, Any]:
        return self._request(
            "PUT",
            f"{self._entry_path(entry_id)}/published",
            headers={"X-Contentful-Version": str(version)},
        )

    def _entry_path(self, entry_id: str) -> str:
        return f"/spaces/{self.config.space_id}/environments/{self.config.environment_id}/entries/{entry_id}"

    def _request(
        self,
        method: str,
        path: str,
        *,
        body: dict[str, Any] | None = None,
        headers: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        request_headers = {
            "Authorization": f"Bearer {self.config.management_token}",
            "Content-Type": "application/vnd.contentful.management.v1+json",
        }
        request_headers.update(headers or {})

        data = json.dumps(body).encode("utf-8") if body is not None else None
        request = Request(
            f"{CONTENTFUL_CMA_BASE_URL}{path}",
            data=data,
            headers=request_headers,
            method=method,
        )

        try:
            with urlopen(request) as response:
                response_body = response.read().decode("utf-8")
        except HTTPError as error:
            if error.code == 404:
                raise
            details = error.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Contentful CMA request failed with {error.code}: {details}") from error

        return json.loads(response_body) if response_body else {}


def _localize_fields(fields: dict[str, Any], locale: str) -> dict[str, dict[str, Any]]:
    return {field_id: {locale: value} for field_id, value in fields.items()}
