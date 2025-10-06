ALTER TABLE performances
DROP CONSTRAINT performance_unique;

ALTER TABLE performances
ADD CONSTRAINT performance_unique PRIMARY KEY (player_id, match_id);