CREATE TYPE team_enum AS ENUM ('red', 'blue');

ALTER TABLE matches
DROP CONSTRAINT match_player_id_unique;

ALTER TABLE matches
DROP COLUMN player_id,
DROP COLUMN agent_id,
DROP COLUMN won,
DROP COLUMN rounds_won,
DROP COLUMN rounds_lost,
DROP COLUMN acs,
DROP COLUMN kills,
DROP COLUMN deaths,
DROP COLUMN assists,
DROP COLUMN damage_dealt,
DROP COLUMN damage_taken,
DROP COLUMN headshots,
DROP COLUMN bodyshots,
DROP COLUMN legshots,
ADD COLUMN winning_team team_enum NOT NULL;

ALTER TABLE matches
RENAME COLUMN match_id TO id;

ALTER TABLE matches
ADD PRIMARY KEY (id);

CREATE TABLE performances(
    player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team team_enum NOT NULL,
    agent_id uuid NOT NULL,
    score integer NOT NULL CHECK (score >= 0),
    kills integer NOT NULL CHECK (kills >= 0),
    deaths integer NOT NULL CHECK (deaths >= 0),
    assists integer NOT NULL CHECK (assists >= 0),
    damage_dealt integer NOT NULL CHECK (damage_dealt >= 0),
    damage_taken integer NOT NULL CHECK (damage_taken >= 0),
    headshots integer NOT NULL CHECK (headshots >= 0),
    bodyshots integer NOT NULL CHECK (bodyshots >= 0),
    legshots integer NOT NULL CHECK (legshots >= 0),
    ability_casts json,
    rank json,
    behavior json,
    economy json,
    CONSTRAINT performance_unique UNIQUE (player_id, match_id)
);