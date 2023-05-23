-- Active: 1684432420600@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT UNIQUE PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT 
);

INSERT INTO users
values("572824ca-f8d1-11ed-be56-0242ac120002", "italo", "email-ilustrativo@gmail.com", "$2y$10$dQWfT0ZfqRDoX8ps.smW.eXD/9yJG6APOJA1QUnp1ZB8NS6W9Gske", "ADMIN", DATETIME("now", "localtime"), null);
SELECT * FROM users;
CREATE TABLE post(
    id TEXT UNIQUE PRIMARY KEY NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT ,


    Foreign Key (creator_id) REFERENCES users(id)
);

CREATE TABLE like_dislike(
    id_user TEXT NOT NULL,
    id_post TEXT NOT NULL,
    like INTEGER,

    Foreign Key (id_user) REFERENCES users(id),
    Foreign Key (id_post) REFERENCES post(id)
);

CREATE TABLE comment_post(
    id TEXT UNIQUE PRIMARY KEY NOT NULL,
    id_user NOT NULL,
    id_post NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT ,


    Foreign Key (id_user) REFERENCES users(id),
    Foreign Key (id_post) REFERENCES post(id)
);
CREATE TABLE like_dislike_comment_post(
    id_user TEXT NOT NULL,
    id_comment TEXT NOT NULL,
    like INTEGER,

    Foreign Key (id_user) REFERENCES users(id),
    Foreign Key (id_comment) REFERENCES comment_post(id)
);
