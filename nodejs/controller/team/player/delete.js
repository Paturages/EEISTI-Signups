var db = require('../../../model/database.js');
var dao_team = require('../../../model/team.js');
var dao_player = require('../../../model/player.js');

var req;
var res;
var target;

function process() {
	target = '/signup?event=success';
	dao_player.read(req.body.id, function(err, player) {
		if (err) {
			console.log(err);
			target = '/signup?event=fail';
			res.redirect(target);
			db.disconnect();
		} else if (player) {
			dao_team.read(player.id_team, function(err, team) {
				if (dao_team.construct(team).checkPassword(req.body.password)) {
					dao_player.read_by_team(team.id, function(err, players) {
						if (err) {
							console.log(err);
							target = '/signup?event=fail';
						}
						dao_player.drop(req.body.id, function(err) {
							if (err) {
								console.log(err);
								target = '/signup?event=fail';
							}
							res.redirect(target);
							db.disconnect();
						});
					});
				} else {
					target = '/signup?event=wrong';
					res.redirect(target);
					db.disconnect();
				}
			});
		} else {
			target = '/signup?event=404';
			res.redirect(target);
			db.disconnect();
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