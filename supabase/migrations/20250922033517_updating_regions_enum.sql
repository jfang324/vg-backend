CREATE TYPE new_region_enum AS ENUM ('na', 'eu', 'latam', 'br', 'ap', 'kr');

ALTER TABLE players
ALTER COLUMN region TYPE new_region_enum
USING region::text::new_region_enum;

DROP TYPE region_enum;

ALTER TYPE new_region_enum RENAME TO region_enum;