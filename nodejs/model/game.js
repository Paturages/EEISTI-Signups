/**
* game.js : The Game object
* @author INGOUFF Christian - for E-EISTI
*/

var db = require('./database.js');

module.exports.create = function(game, callback) {
	db.request('insert into Game(max_players, short, full_name, nickname_field, multicampus) values ($1, $2, $3, $4, $5) returning id', [game.max_players.toString(), game.short, game.full_name, game.nickname_field, game.multicampus], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, result.rows[0]);
		}
	});
}

module.exports.read = function(id, callback) {
	db.request('select * from Game where id=$1', [id.toString()], function(err, result) {
		if (err) {
			callback(err);
		} else {
			if (result.rows.length > 0) {
				callback(null, result.rows[0]);
			} else {
				callback();
			}
		}
	});
}

module.exports.update = function(game, callback) {
	db.request('update Game set max_players=$2, short=$3, full_name=$4, nickname_field=$5, multicampus=$6 where id=$1', [game.id.toString(), game.max_players.toString(), game.short, game.full_name, game.nickname_field, game.multicampus], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});	
}

module.exports.drop = function(id, callback) {
	db.request('delete from Game where id=$1', [id.toString()], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});
}