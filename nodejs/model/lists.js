/**
* lists.js : Getting lists of things
* @author INGOUFF Christian - for E-EISTI
*/

var db = require('./database.js'); /* Everything base de données */

module.exports.getGames = function(callback) {
	db.request('select * from Game', function(err, result) {
		if (err) {
			console.log("error list games");
			callback(err);
		} else {
			callback(null, result.rows);
		}
	});
}

module.exports.getList = function(game, callback) {
	db.request('select * from Solo where id_game=$1', [game.toString()], function(err, result) {
		if (err) {
			console.log("error list "+game.toString());
			callback(err);
		} else {
			callback(null, result.rows);
		}
	});
}

module.exports.getTeams = function(game, callback) {
	db.request('select * from Team where id_game=$1', [game.toString()], function(err, result) {
		if (err) {
			console.log("error teams "+game.toString());
			callback(err);
		} else {
			callback(null, result.rows);
		}
	});
}

module.exports.getPlayersByTeam = function(team, callback) {
	var param = [team.toString()];
	db.request('select * from Player where id_team=$1', param, function(err, result) {
		if (err) {
			console.log("error players : number "+team.toString());
			callback(err);
		} else {
			callback(null, result.rows);
		}
	});
}