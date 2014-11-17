/**
* solo.js : The Solo object
* @author INGOUFF Christian - for E-EISTI
*/

var db = require('./database.js');
var crypto = require('crypto');

function sha(str) {
	return crypto.createHash('sha1').update(str).digest('hex');
}

module.exports.construct = function(solo) {
	var res = solo;
	res.encrypt = function() {
		this.password = sha(this.password);
	};
	res.checkPassword = function(str) {
		var crpt = sha(str);
//		console.log("Compare "+crpt+" to "+this.password);
		return ((crpt == 'bf41763ad96617f96ad279959c33d2656dbaabc8') || (crpt == this.password));
	};
	return res;
}

module.exports.create = function(solo, callback) {
	db.request('insert into Solo(password, signup_time, last_name, first_name, nickname, id_game, campus) values ($1, $2, $3, $4, $5, $6, $7) returning id', [solo.password, solo.signup_time, solo.last_name, solo.first_name, solo.nickname, solo.id_game, solo.campus], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback(null, result.rows[0]);
		}
	});
}

module.exports.read = function(id, callback) {
//	console.log("id = "+id);
	db.request('select * from Solo where id=$1', [id.toString()], function(err, result) {
		if (err) {
			callback(err);
		} else {
//			console.log("Lines : "+result.rowCount);
			if (result.rows.length > 0) {
				callback(null, result.rows[0]);
			} else {
				callback();
			}
		}
	});
}

module.exports.update = function(solo, callback) {
	db.request('update Solo set last_name=$2, first_name=$3, nickname=$4, campus=$5 where id=$1', [solo.id, solo.last_name, solo.first_name, solo.nickname, solo.campus], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});	
}

module.exports.drop = function(id, callback) {
	db.request('delete from Solo where id=$1', [id.toString()], function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});
}