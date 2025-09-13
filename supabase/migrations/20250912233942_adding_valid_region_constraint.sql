CREATE TYPE region_enum AS ENUM ('na', 'eu', 'lt', 'br', 'ap', 'kr');

ALTER TABLE players
ALTER COLUMN region TYPE region_enum
USING region::region_enum;