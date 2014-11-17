var db = require('../../model/database.js');
var dao_team = require('../../model/team.js');
var dao_player = require('../../model/player.js');

var req;
var res;
var target;

function process() {
	target = '/signup?event=success';
	dao_team.read(req.body.id, function(err, team) {
		if (err) {
			console.log(err);
			target = '/signup?event=fail';
			res.redirect(target);
			db.disconnect();
		} else if (team) {
			if (dao_team.construct(team).checkPassword(req.body.password)) {
				dao_player.drop_by_team(req.body.id, function(err) {
					if (err) {
						console.log(err);
						target = '/signup?event=fail';
					}
					dao_team.drop(req.body.id, function(err) {
						if (err) {
							console.log(err);
							target = '/signup?event=fail';
						}
						res.redirect(target);
						db.disconnect();
					});
				});
			} else {
				console.log("Wrong password.");
				target = '/signup?event=wrong';
				res.redirect(target);
				db.disconnect();
			}
		} else {
			console.log("Team not found.");
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