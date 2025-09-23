CREATE TABLE agents (
    id uuid PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE maps (
    id uuid PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE modes (
    id text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    mode_type text NOT NULL
);