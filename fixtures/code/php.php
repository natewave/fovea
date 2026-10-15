<?php

declare(strict_types=1);

namespace Fovea\Palette;

use InvalidArgumentException;

final class Swatch
{
    public function __construct(
        public readonly string $role,
        public readonly string $hex,
        public readonly float $lc,
    ) {
        if (!preg_match('/^#[0-9a-f]{6}$/i', $hex)) {
            throw new InvalidArgumentException("Invalid hex color: {$hex}");
        }
    }

    public function passes(float $floor): bool
    {
        return abs($this->lc) >= $floor;
    }
}

/** @param list<Swatch> $swatches */
function report(array $swatches, float $floor = 90.0): string
{
    $failing = array_filter($swatches, fn (Swatch $s): bool => !$s->passes($floor));
    return sprintf('%d of %d swatches fail Lc %.0f', count($failing), count($swatches), $floor);
}

echo report([new Swatch('fg', '#2f2a25', 95.1), new Swatch('muted', '#8a857c', 48.0)]) . PHP_EOL;
