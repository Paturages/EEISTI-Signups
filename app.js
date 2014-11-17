var express = require('express');
var bparser = require('body-parser');
var toSignup = function(req,res) {
	res.redirect('/signup');
};

var index = require('./nodejs/controller/index.js');

var solo_insert = require('./nodejs/controller/solo/insert.js');
var solo_edit = require('./nodejs/controller/solo/edit.js');
var solo_drop = require('./nodejs/controller/solo/delete.js');

var team_insert = require('./nodejs/controller/team/insert.js');
var team_edit = require('./nodejs/controller/team/edit.js');
var team_drop = require('./nodejs/controller/team/delete.js');

var team_player_drop = require('./nodejs/controller/team/player/delete.js');

var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bparser.json());       // to support JSON-encoded bodies
app.use(bparser.urlencoded({
	extended: true
})); // to support URL-encoded bodies

/* Une grosse tâche de mapping */
app.get('/signup', index.write);

app.get('/signup/solo', toSignup);
app.get('/signup/solo/', toSignup);
app.get('/signup/solo/insert', toSignup);
app.get('/signup/solo/insert/', toSignup);
app.get('/signup/solo/delete', toSignup);
app.get('/signup/solo/delete/', toSignup);
app.get('/signup/solo/edit', toSignup);
app.get('/signup/solo/edit/', toSignup);
app.get('/signup/team', toSignup);
app.get('/signup/team/', toSignup);
app.get('/signup/team/insert', toSignup);
app.get('/signup/team/insert/', toSignup);
app.get('/signup/team/delete', toSignup);
app.get('/signup/team/delete/', toSignup);
app.get('/signup/team/edit', toSignup);
app.get('/signup/team/edit/', toSignup);

app.post('/signup/solo/insert', solo_insert.write);
app.post('/signup/solo/delete', solo_drop.write);
app.post('/signup/solo/edit', solo_edit.write);

app.post('/signup/team/insert', team_insert.write);
app.post('/signup/team/delete', team_drop.write);
app.post('/signup/team/edit', team_edit.write);
app.post('/signup/team/player/delete', team_player_drop.write);

app.listen(8080);
console.log('Hosted at http://127.0.0.1:8080/signup/');