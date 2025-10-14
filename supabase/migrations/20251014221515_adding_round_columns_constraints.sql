ALTER TABLE matches ALTER COLUMN red_rounds SET NOT NULL;
ALTER TABLE matches ALTER COLUMN blue_rounds SET NOT NULL;

ALTER TABLE matches ADD CONSTRAINT red_rounds_check CHECK (red_rounds >= 0);
ALTER TABLE matches ADD CONSTRAINT blue_rounds_check CHECK (blue_rounds >= 0);