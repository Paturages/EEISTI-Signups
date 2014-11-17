var db = require('../../model/database.js');
var dao_solo = require('../../model/solo.js');

var req;
var res;
var target;

function process() {
	target = '/signup?event=success';
	dao_solo.read(req.body.id, function(err, solo) {
		if (err) {
			console.log(err);
			target = '/signup?event=fail';
		} else {
			if (dao_solo.construct(solo).checkPassword(req.body.password)) {
				solo.last_name = req.body.last_name;
				solo.first_name = req.body.first_name;
				solo.nickname = req.body.nickname;
				solo.campus = req.body.campus;
				dao_solo.update(solo, function(err) {
					if (err) {
						console.log(err);
						target = '/signup?event=fail';
					}
					res.redirect(target);
					db.disconnect();
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