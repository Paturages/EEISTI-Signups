$(document).ready(function() {
	$('#signup-team').on('hidden.bs.modal', function () {
		$('#signup-team-body').children('.signup-team-player').remove();
	});
});

/* SOLO FUNCTIONS */

function onSolo(id, game, nickname_handle, multicampus) {
	if (!multicampus) {
		$('#signup-solo-campus').attr('hidden','hidden');
		$('#signup-solo-cergy').prop("checked", true);
	} else {
		$('#signup-solo-campus').removeAttr('hidden');
	}
	$('#signup-solo-form').attr('action','/signup/solo/insert');
	document.getElementById("signup-solo-label").innerHTML = "Inscription : "+game;
	document.getElementById("signup-solo-nickname_handle").innerHTML = nickname_handle+" :";
	document.getElementById("solo-game").value = id;
}
function onEditSolo(id, game, nickname_handle, solo_id, last_name, first_name, nickname, multicampus) {
	if (!multicampus) {
		$('#signup-solo-campus').attr('hidden','hidden');
		$('#signup-solo-cergy').prop("checked", true);
	} else {
		$('#signup-solo-campus').removeAttr('hidden');
	}
	$('#signup-solo-form').attr('action','/signup/solo/edit');
	document.getElementById("signup-solo-label").innerHTML = "Modification : "+game;
	document.getElementById("signup-solo-nickname_handle").innerHTML = nickname_handle+" :";
	document.getElementById("solo-game").value = id;
	
	$("#signup-solo-id").attr('value',solo_id);
	$("#signup-solo-last_name").attr('value',last_name);
	$("#signup-solo-first_name").attr('value',first_name);
	$("#signup-solo-nickname").attr('value',nickname);
}

function onDeleteSolo(game, solo_id) {
	$('#delete-form').attr('action','/signup/solo/delete');
	document.getElementById("delete-label").innerHTML = "Suppression joueur : "+game;
	document.getElementById("delete-id").value = solo_id;
}

/* TEAM FUNCTIONS */

function onTeam(id, game, nickname_handle, max_players, multicampus) {
	if (!multicampus) {
		$('#signup-team-campus').attr('hidden','hidden');
		$('#signup-team-cergy').prop("checked", true);
	} else {
		$('#signup-team-campus').removeAttr('hidden');
	}
	$("#max-players").attr('value',max_players);
	$('#signup-team-form').attr('action','/signup/team/insert');
	
	document.getElementById("signup-team-label").innerHTML = "Inscription "+game;
	var nicks = document.getElementsByClassName("signup-team-nickname");
	nicks[0].innerHTML = nickname_handle+" :";
	document.getElementById("team-id").value = id;
	
	var $template = $('#addTeamTemplate');
	var $clone = $template.clone().removeAttr('id').addClass("signup-team-player");
	$clone.children('p').html("Joueur 1");
	$clone.appendTo($('#signup-team-body'));
	setTimeout(function(){$clone.addClass('in')}, 200);
}

/* TO DO : Find a better, less dirty way to get the list of players in a team ;_; */
function onEditTeam(id_team, game, nickname_handle, max_players, multicampus, tname, campus, players) {
	if (!multicampus) {
		$('#signup-team-campus').attr('hidden','hidden');
		$('#signup-team-cergy').prop("checked", true);
	} else {
		$('#signup-team-campus').removeAttr('hidden');
		if (campus == "Cergy") {
			$('#signup-team-cergy').prop("checked", true);
		} else {
			$('#signup-team-pau').prop("checked", true);
		}
	}
	$("#max-players").attr('value',max_players);
	$('#signup-team-form').attr('action','/signup/team/edit');
	
	document.getElementById("signup-team-label").innerHTML = "Modification "+game;
	var nicks = document.getElementsByClassName("signup-team-nickname");
	nicks[0].innerHTML = nickname_handle+" :";
	document.getElementById("team-id").value = id_team;
	document.getElementById("signup-team-tname").value = tname;
	
	var $template = $('#addTeamTemplate');
	var $clone = $template.clone().removeAttr('id').addClass("signup-team-player");
	$clone.children('p').html("Joueur 1");
	$clone.appendTo($('#signup-team-body'));
	$clone.addClass('in');
	
	$clone.children().eq(1).children().last().attr('value',players[0].last_name);
	$clone.children().eq(2).children().last().attr('value',players[0].first_name);
	$clone.children().eq(3).children().last().attr('value',players[0].nickname);
	
	for (i = 1 ; i < players.length ; i++) {
		add_player($clone.children().last());
		$clone = $('#signup-team-body').children().last();
		$clone.children().eq(1).children().last().attr('value',players[i].last_name);
		$clone.children().eq(2).children().last().attr('value',players[i].first_name);
		$clone.children().eq(3).children().last().attr('value',players[i].nickname);
	}
}

function onDeleteTeam(game, team_id) {
	$('#delete-form').attr('action','/signup/team/delete');
	document.getElementById("delete-label").innerHTML = "Suppression équipe : "+game;
	document.getElementById("delete-id").value = team_id;
}

function onDeleteTeamPlayer(game, player_id) {
	$('#delete-form').attr('action','/signup/team/player/delete');
	document.getElementById("delete-label").innerHTML = "Suppression joueur : "+game;
	document.getElementById("delete-id").value = player_id;
}

function add_player($element) {
	var $player = $('#signup-team-body').children('.signup-team-player').length;
	var $max_players = parseInt($('#max-players').attr('value'));
	
	$element.attr('onclick',"remove_player("+$player+",$(this).parent())");
	$element.children().first().attr('class',"glyphicon glyphicon-minus");
	$element.children().last().html("Retirer un joueur");
	
	var $template = $('#addTeamTemplate');
	var $clone = $template.clone().removeAttr('id').addClass("signup-team-player");
	
	if ($player >= ($max_players-1)) {
		$clone.children().last().attr('onclick',"remove_player("+$player+",$(this).parent())");
		$clone.children().last().children().first().attr('class',"glyphicon glyphicon-minus");
		$clone.children().last().children().last().html("Retirer un joueur");
	}
	$clone.children('p').html("Joueur "+($player+1));
	$clone.appendTo($('#signup-team-body'));
	setTimeout(function(){$clone.addClass('in')}, 200);
}

function remove_player(player_no, $element) {
	var $players = $('#signup-team-body').children('.signup-team-player');
	var i = $players.length;
	var $tmp = $players.last();
	var first = true;
	
	$element.attr('class',"form-group signup-team-player fade");
	setTimeout(function() {
		while (!($tmp.is($element))) {
			i--;
			$tmp.children().first().html("Joueur "+i);
			if (!first) {
				$tmp.children().last().attr('onclick',"remove_player("+i+",$(this).parent())");
			} else {
				if ($tmp.children().last().children().last().html() == "Retirer un joueur") {
					$tmp.children().last().attr('onclick',"add_player($(this))");
					$tmp.children().last().children().first().attr('class',"glyphicon glyphicon-plus");
					$tmp.children().last().children().last().html("Ajouter un joueur");
				}
				first = false;
			}
			$tmp = $tmp.prev();
		}
		$element.remove();
	}, 200);
}

/* FORM VALIDATION */

function soloValidate() {
	var valid = true;
	var $inputs = $('#signup-solo-body input');
	$inputs.each(function() {
		if (valid) {
			if (typeof $(this).attr('value') == "undefined") {
				$(this).css('background-color','#FFEAEF');
				$('signup-solo').animate({
					scrollTop: $(this).offset().top
				}, 2000);
				valid = false;
			}
		}
	});
	
	if (valid) {
		$('#signup-solo-form').submit();
	}
}

function teamValidate() {
	var valid = true;
	var $inputs = $('#signup-team-body input');
	$inputs.each(function() {
		if (valid) {
			if (typeof $(this).attr('value') == "undefined") {
				$(this).css('background-color','#FFEAEF');
				$('#signup-team').animate({
					scrollTop: $(this).offset().top
				}, 2000);
				valid = false;
			}
		}
	});
	
	if (valid) {
		$('#signup-team-form').submit();
	}
}