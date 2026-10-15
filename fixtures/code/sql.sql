-- Contrast results per variant, with the weakest role first.
CREATE TABLE IF NOT EXISTS swatches (
    id         INTEGER PRIMARY KEY,
    variant    TEXT    NOT NULL CHECK (variant IN ('day', 'dusk', 'night')),
    role       TEXT    NOT NULL,
    hex        CHAR(7) NOT NULL,
    lc         REAL    NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO swatches (variant, role, hex, lc)
VALUES ('day', 'fg', '#2f2a25', 95.1),
       ('dusk', 'fg', '#e3dfd8', -86.0);

WITH ranked AS (
    SELECT variant,
           role,
           ABS(lc) AS strength,
           ROW_NUMBER() OVER (PARTITION BY variant ORDER BY ABS(lc)) AS rank
    FROM swatches
    WHERE lc IS NOT NULL
)
SELECT variant, role, ROUND(strength, 1) AS lc
FROM ranked
WHERE rank = 1
ORDER BY variant;
