drop table if exists Player;
drop table if exists Team;
drop table if exists Solo;
drop table if exists Game;

create table Game (
id SERIAL NOT NULL,
max_players SMALLINT NOT NULL,
short VARCHAR(20) NOT NULL,
full_name VARCHAR(50) NOT NULL,
nickname_field VARCHAR(20) NOT NULL,
multicampus BOOLEAN NOT NULL,
constraint pk_Game PRIMARY KEY (id)
);

create table Solo (
id SERIAL NOT NULL,
password VARCHAR(40) NOT NULL,
signup_time TIMESTAMP NOT NULL,
last_name VARCHAR(50) NOT NULL,
first_name VARCHAR(50) NOT NULL,
nickname VARCHAR(50) NOT NULL,
id_game SERIAL NOT NULL,
campus VARCHAR(10) NOT NULL,
constraint pk_Solo PRIMARY KEY (id),
constraint fk_id_game FOREIGN KEY(id_game) REFERENCES Game (id) ON DELETE CASCADE
);

create table Team (
id SERIAL NOT NULL,
password VARCHAR(40) NOT NULL,
signup_time TIMESTAMP NOT NULL,
tname VARCHAR(50) NOT NULL,
id_game SERIAL NOT NULL,
campus VARCHAR(10) NOT NULL,
constraint pk_Team PRIMARY KEY (id),
constraint fk_id_game FOREIGN KEY(id_game) REFERENCES Game (id) ON DELETE CASCADE
);

create table Player (
id SERIAL NOT NULL,
last_name VARCHAR(50) NOT NULL,
first_name VARCHAR(50) NOT NULL,
nickname VARCHAR(50) NOT NULL,
id_team SERIAL NOT NULL,
constraint fk_id_team FOREIGN KEY(id_team) REFERENCES Team (id) ON DELETE CASCADE,
constraint pk_Player PRIMARY KEY (id)
);