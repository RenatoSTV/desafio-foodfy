DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int,
  "file_id" int
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "reset_token" TEXT,
  "reset_token_expires" TEXT,
  "is_admin" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT(now()),
  "updated_at" TIMESTAMP DEFAULT(now())
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- cascade effect when delete user and products
ALTER TABLE "recipes"
DROP CONSTRAINT recipes_user_id_fkey,
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_recipe_id_fkey,
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_file_id_fkey,
ADD CONSTRAINT recipe_files_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;