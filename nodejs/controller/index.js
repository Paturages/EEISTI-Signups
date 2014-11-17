var db = require('../model/database.js');
var qu = require('../model/lists.js');

/* Asynchronous is so mind-fucking ;_; */
function capture_iterator(i, callback) {
	callback(i);
}

module.exports.write = function(req, res) {
	var attbs = {};
	attbs.alert = {};
	var count = 0;
	var qu_amount = 0;
	
	if (req.query.event) {
		if (req.query.event == "success") {
			attbs.alert.type = "alert-success";
			attbs.alert.content = "Opération effectuée.";
		} else {
			attbs.alert.type = "alert-danger";
			if (req.query.event == '404') {
				attbs.alert.content = "Erreur : Joueur ou équipe non trouvé(e).";
			} else if (req.query.event == 'wrong') {
				attbs.alert.content = "Erreur : Mauvais mot de passe.";
			} else if (req.query.event == 'fail') {
				attbs.alert.content = "Erreur : L'opération a échoué. Veuillez contacter le bureau (contact.eeisti@gmail.com) à ce sujet.";
			} else {
				attbs.alert.content = "Vous vous amusez bien ?";
			}
		}
	}
	
	db.connect(function(err) {
		if (err) {
			console.log(err);
		} else {
			qu.getGames(function(err, games) {
				if (err) {
					console.log(err);
				} else {
					attbs.games = games;
					qu_amount += games.length;
					if (games.length == 0) {
						attbs.alert.type = "alert-danger";
						attbs.alert.content = "Erreur : Il n'y a pas de jeux dans la base de données. Veuillez contacter le bureau (contact.eeisti@gmail.com) à ce sujet.";
						res.render('index.ejs', attbs);
						db.disconnect();
					} else {
						for (var i = 0 ; i < games.length ; i++) {
							if (attbs.games[i].max_players == 1) {
								capture_iterator(i, function(tmp_i) {
									qu.getList(attbs.games[i].id, function(err, players) {
										count++;
										if (err) {
											console.log(err);
											attbs.games[tmp_i].players = [];
											attbs.alert.type = "alert-danger";
											attbs.alert.content = "Erreur : L'affichage est erroné. Veuillez contacter le bureau (contact.eeisti@gmail.com) à ce sujet.";
										} else {
											attbs.games[tmp_i].players = players;
										}
										if (count == qu_amount) {
											res.render('index.ejs', attbs);
											db.disconnect();
										}
									});
								});
							} else {
								capture_iterator(i, function(tmp_i) {
									qu.getTeams(attbs.games[i].id, function(err, teams) {
										count++;										
										if (err) {
											console.log(err);
											attbs.games[tmp_i].players = [];
											attbs.alert.type = "alert-danger";
											attbs.alert.content = "Erreur : L'affichage est erroné. Veuillez contacter le bureau (contact.eeisti@gmail.com) à ce sujet.";
											if (count == qu_amount) {
												res.render('index.ejs', attbs);
												db.disconnect();
											}
										} else {
											qu_amount += teams.length;
											attbs.games[tmp_i].teams = teams;
											for (var j = 0 ; j < teams.length ; j++) {
												capture_iterator(j, function(tmp_j) {
													qu.getPlayersByTeam(attbs.games[tmp_i].teams[j].id, function(err, players) {
														count++;
														if (err) {
															console.log(err);
															attbs.games[tmp_i].teams[tmp_j].players = [];
															attbs.alert.type = "alert-danger";
															attbs.alert.content = "Erreur : L'affichage est erroné. Veuillez contacter le bureau (contact.eeisti@gmail.com) à ce sujet.";
														} else {
															attbs.games[tmp_i].teams[tmp_j].players = players;
														}
														if (count == qu_amount) {
															res.render('index.ejs', attbs);
															db.disconnect();
														}
													});
												});
											}
										}
									});
								});
							}
						}
					}
				}
			});
		}
	});
}