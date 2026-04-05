import json
import os
import time
from typing import Any, Dict, Tuple

import requests
from requests.adapters import HTTPAdapter
from requests.exceptions import RequestException
from urllib3.util.retry import Retry


def build_retry_session(user_agent: str, pool_size: int = 20) -> requests.Session:
    """Create a requests session configured with automatic retries."""
    session = requests.Session()
    session.headers.update({"User-Agent": user_agent})

    retry = Retry(
        total=5,
        connect=5,
        read=5,
        status=5,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=frozenset(["GET"]),
        raise_on_status=False,
    )

    adapter = HTTPAdapter(max_retries=retry, pool_connections=pool_size, pool_maxsize=pool_size)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session


def get_json(session: requests.Session, url: str, timeout: int = 20, max_attempts: int = 3) -> Dict[str, Any]:
    """GET JSON with timeout and local retry attempts."""
    last_error = None
    for attempt in range(1, max_attempts + 1):
        try:
            response = session.get(url, timeout=timeout)
            response.raise_for_status()
            return response.json()
        except (RequestException, ValueError) as error:
            last_error = error
            if attempt == max_attempts:
                break
            sleep_seconds = attempt
            print(f"[WARN] Request failed ({attempt}/{max_attempts}) for {url}: {error}")
            print(f"[INFO] Retrying in {sleep_seconds}s...")
            time.sleep(sleep_seconds)

    raise RuntimeError(f"Failed to fetch JSON from {url}") from last_error


def load_checkpoint(checkpoint_path: str, default_data: Any) -> Tuple[int, Any]:
    """Load checkpoint if present, else return clean state."""
    if not os.path.exists(checkpoint_path):
        return 0, default_data

    try:
        with open(checkpoint_path, "r", encoding="utf-8") as file:
            payload = json.load(file)

        next_index = int(payload.get("next_index", 0))
        data = payload.get("data", default_data)
        print(f"[INFO] Resuming from checkpoint: index={next_index}")
        return next_index, data
    except Exception as error:
        print(f"[WARN] Could not read checkpoint {checkpoint_path}: {error}")
        print("[INFO] Starting from scratch.")
        return 0, default_data


def save_checkpoint(checkpoint_path: str, next_index: int, data: Any) -> None:
    """Save checkpoint atomically when possible, with Windows-safe fallback."""
    os.makedirs(os.path.dirname(checkpoint_path), exist_ok=True)
    payload = {
        "next_index": next_index,
        "data": data,
    }
    temp_path = f"{checkpoint_path}.tmp"

    # Write temp file first.
    with open(temp_path, "w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)

    # On Windows, antivirus/indexers can transiently lock checkpoint file.
    # Retry atomic replace a few times before falling back to direct write.
    for attempt in range(1, 6):
        try:
            os.replace(temp_path, checkpoint_path)
            return
        except PermissionError as error:
            if attempt == 5:
                print(f"[WARN] Atomic checkpoint replace failed for {checkpoint_path}: {error}")
                break
            time.sleep(0.15 * attempt)

    # Best-effort fallback to avoid aborting long imports.
    try:
        with open(checkpoint_path, "w", encoding="utf-8") as file:
            json.dump(payload, file, ensure_ascii=False, indent=2)
        if os.path.exists(temp_path):
            os.remove(temp_path)
    except Exception as error:
        print(f"[WARN] Could not persist checkpoint {checkpoint_path}: {error}")


def clear_checkpoint(checkpoint_path: str) -> None:
    if os.path.exists(checkpoint_path):
        os.remove(checkpoint_path)
