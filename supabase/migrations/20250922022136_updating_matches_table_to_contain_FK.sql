ALTER TABLE matches
DROP COLUMN map,
ADD COLUMN map_id uuid REFERENCES maps(id);

ALTER TABLE matches
DROP COLUMN mode,
ADD COLUMN mode_id text REFERENCES modes(id);