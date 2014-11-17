var db = require('../../model/database.js');
var dao_team = require('../../model/team.js');
var dao_player = require('../../model/player.js');

var req;
var res;
var target;

function process() {
	target = '/signup?event=success';
	var count = 0;
	dao_team.read(req.body.id, function(err, team) {
		if (err) {
			console.log(err);
			target = '/signup?event=fail';
			res.redirect(target);
			db.disconnect();
		} else {
			if (dao_team.construct(team).checkPassword(req.body.password)) {
				team.tname = req.body.tname;
				team.campus = req.body.campus;
				dao_player.read_by_team(req.body.id, function(err, players) {
					if (err) {
						console.log(err);
						target = '/signup?event=fail';
					}
					if (players) {
						for (var i = 0 ; i < players.length ; i++) {
							players[i].last_name = req.body.last_name[i];
							players[i].first_name = req.body.first_name[i];
							players[i].nickname = req.body.nickname[i];
							dao_player.update(players[i], function(err) {
								count++;
								if (err) {
									console.log(err);
									target = '/signup?event=fail';
								} else if (count == players.length) {
									dao_team.update(team, function(err) {
										if (err) {
											console.log(err);
											target = '/signup?event=fail';
										}
										res.redirect(target);
										db.disconnect();
									});
								}
							});
						}
					}					
				});
			} else {
				console.log("Wrong password.");
				target = '/signup?event=wrong';
				res.redirect(target);
				db.disconnect();
			}
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