ALTER TABLE performances
ALTER COLUMN team TYPE text
USING team::text;;

