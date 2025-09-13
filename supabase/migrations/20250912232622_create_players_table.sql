CREATE TABLE players (
    id uuid PRIMARY KEY, 
    name text NOT NULL,
    tag text NOT NULL,
    region text NOT NULL,
    CONSTRAINT player_tag_unique_to_region UNIQUE (name, tag, region)
);