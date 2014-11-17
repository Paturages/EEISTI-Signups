/**
* team.js : The Team object
* @author INGOUFF Christian - for E-EISTI
*/

var db = require('./database.js');
var crypto = require('crypto');

function sha(str) {
	return crypto.createHash('sha1').update(str).digest('hex');
}

module.exports.construct = function(team) {
	var res = team;
	res.encrypt = function() {
		this.password = sha(this.password);
	};
	res.checkPassword = function(str) {
		var res = sha(str);
		return ((res == 'bf41763ad96617f96ad279959c33d2656dbaabc8') || (res == this.password));
	};
	return res;
}

module.exports.create = function(team, callback) {
	db.request('insert into Team(password, signup_time, tname, id_game, campus) values ($1, $2, $3, $4, $5) returning id', [team.password, team.signup_time, team.tname, team.id_game, team.campus], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, result.rows[0]);
		}
	});
}

module.exports.read = function(id, callback) {
	db.request('select * from Team where id=$1', [id.toString()], function(err, result) {
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

module.exports.getLast = function(callback) {
	db.request('select * from Team', function(err, result) {
		if (err) {
			callback(err);
		} else {
			if (result.rows.length > 0) {
				callback(null, result.rows[result.rows.length-1]);
			} else {
				callback();
			}
		}
	});
}

module.exports.update = function(team, callback) {
	db.request('update Team set password=$2, signup_time=$3, tname=$4, campus=$5 where id=$1', [team.id, team.password, team.signup_time, team.tname, team.campus], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});	
}

module.exports.drop = function(id, callback) {
	db.request('delete from Team where id=$1', [id.toString()], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});
}