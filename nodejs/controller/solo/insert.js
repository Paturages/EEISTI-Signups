var db = require('../../model/database.js');
var dao_solo = require('../../model/solo.js');

var req;
var res;
var target;

function process() {
	target = '/signup?event=success';
	var solo = dao_solo.construct({
		password: req.body.password,
		signup_time: new Date(),
		last_name: req.body.last_name,
		first_name: req.body.first_name,
		nickname: req.body.nickname,
		id_game: req.body.game,
		campus: req.body.campus
	});
	solo.encrypt();
	
	dao_solo.create(solo, function(err, result) {
		if (err) {
			console.log(err);
			target = '/signup?event=fail';
		}
		res.redirect(target);
		db.disconnect();
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