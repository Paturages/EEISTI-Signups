/**
* player.js : The Player object
* @author INGOUFF Christian - for E-EISTI
*/

var db = require('./database.js');

module.exports.create = function(player, callback) {
	db.request('insert into Player(last_name, first_name, nickname, id_team) values ($1, $2, $3, $4) returning id', [player.last_name, player.first_name, player.nickname, player.id_team], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, result.rows[0]);
		}
	});
}

module.exports.read = function(id, callback) {
	db.request('select * from Player where id=$1', [id.toString()], function(err, result) {
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

module.exports.read_by_team = function(id, callback) {
	db.request('select * from Player where id_team=$1', [id.toString()], function(err, result) {
		if (err) {
			callback(err);
		} else {
			if (result.rows.length > 0) {
				callback(null, result.rows);
			} else {
				callback();
			}
		}
	});
}

module.exports.update = function(player, callback) {
	db.request('update Player set last_name=$2, first_name=$3, nickname=$4 where id=$1', [player.id.toString(), player.last_name, player.first_name, player.nickname], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});	
}

module.exports.drop = function(id, callback) {
	db.request('delete from Player where id=$1', [id.toString()], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});
}

module.exports.drop_by_team = function(id, callback) {
	db.request('delete from Player where id_team=$1', [id.toString()], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});
}