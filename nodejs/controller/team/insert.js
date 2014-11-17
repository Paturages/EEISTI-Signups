var db = require('../../model/database.js');
var dao_team = require('../../model/team.js');
var dao_player = require('../../model/player.js');

var req;
var res;
var target;

function process() {
	target = '/signup?event=success';
	var i;
	var count = 0;
	var team = dao_team.construct({
		password: req.body.password,
		signup_time: new Date(),
		tname: req.body.tname,
		id_game: req.body.id,
		campus: req.body.campus
	});
	team.encrypt();
	
	dao_team.create(team, function(err, last_team) {
		if (err) {
			console.log(err);
			target = '/signup?event=fail';
		}
		for (i = 0 ; i < req.body.last_name.length ; i++) {
			dao_player.create({
				last_name: req.body.last_name[i],
				first_name: req.body.first_name[i],
				nickname: req.body.nickname[i],
				id_team: last_team.id,
			}, function(err, result) {
				count++;
				if (err) {
					console.log(err);
					target = '/signup?event=fail';
				} else if (count == req.body.last_name.length) {
					res.redirect(target);
					db.disconnect();
				}
			});
		}
	});
}

module.exports.write = function(request, result) {
	req = request;
	res = result;
	db.connect(function(err) {
		if (err) {
			console.log(err);
			target = '/signup?event=fail';
			res.redirect(target);
		} else {
			process();
		}
	});
}