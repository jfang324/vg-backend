ALTER TABLE players
ADD COLUMN level integer NOT NULL CHECK (level > 0) DEFAULT 1,
ADD COLUMN customization jsonb NOT NULL DEFAULT '{"card": "0e435790-4300-e6a1-85df-09ade8c188ab", "title": "ed96f7bd-4eed-de28-8c93-40bd313a3157", "preferred_level_border": null}'::jsonb, 
ADD COLUMN rank json NOT NULL DEFAULT '{"id": 1, "name": "Iron 1"}'::jsonb;

