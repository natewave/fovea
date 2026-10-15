"""Summarize reading-speed results from a polarity experiment."""

from __future__ import annotations

import csv
import re
import statistics
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable

PARTICIPANT_ID = re.compile(r"^P(\d{3})$")
POLARITIES = ("light", "dark")


@dataclass(frozen=True)
class Trial:
    participant: str
    polarity: str
    seconds: float
    errors: int = 0
    notes: list[str] = field(default_factory=list)


def load_trials(path: Path) -> list[Trial]:
    """Read trials from a CSV file, skipping malformed rows."""
    trials: list[Trial] = []
    with path.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if not PARTICIPANT_ID.match(row["participant"]):
                continue
            trials.append(
                Trial(row["participant"], row["polarity"], float(row["seconds"]), int(row["errors"]))
            )
    return trials


def mean_seconds(trials: Iterable[Trial], polarity: str) -> float:
    times = [t.seconds for t in trials if t.polarity == polarity]
    if not times:
        raise ValueError(f"no trials for polarity {polarity!r}")
    return statistics.fmean(times)


if __name__ == "__main__":
    trials = load_trials(Path("results.csv"))
    for polarity in POLARITIES:
        print(f"{polarity:>5}: {mean_seconds(trials, polarity):.2f} s\tn={len(trials)}")
