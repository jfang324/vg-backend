CREATE TYPE map_enum AS ENUM ('ascent', 'haven', 'bind', 'split', 'icebox', 'breeze', 'lotus', 'pearl', 'sunset', 'fracture', 'abyss', 'corrode', 'district', 'kabash', 'piazza', 'drift', 'glitch'); 
CREATE TYPE mode_enum AS ENUM ('competitive', 'unrated', 'deathmatch', 'team_deathmatch');  

CREATE TABLE matches(
    player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    match_id uuid NOT NULL,
    agent_id uuid NOT NULL,
    map map_enum NOT NULL,
    mode mode_enum NOT NULL,
    won boolean NOT NULL,
    rounds_won integer NOT NULL CHECK (rounds_won >= 0),
    rounds_lost integer NOT NULL CHECK (rounds_lost >= 0),
    acs float NOT NULL CHECK (acs >= 0),
    kills integer NOT NULL CHECK (kills >= 0),
    deaths integer NOT NULL CHECK (deaths >= 0),
    assists integer NOT NULL CHECK (assists >= 0),
    damage_dealt integer NOT NULL CHECK (damage_dealt >= 0),
    damage_taken integer NOT NULL CHECK (damage_taken >= 0),
    headshots integer NOT NULL CHECK (headshots >= 0),
    bodyshots integer NOT NULL CHECK (bodyshots >= 0),
    legshots integer NOT NULL CHECK (legshots >= 0),
    date timestamptz NOT NULL,
    CONSTRAINT match_player_id_unique UNIQUE (player_id, match_id)
);

CREATE INDEX idx_matches_match_id ON matches(match_id);