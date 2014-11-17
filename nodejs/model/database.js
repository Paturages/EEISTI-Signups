/**
* database.js : Connexion à la base de données PostgreSQL
* @author Groupe BDD - Projet GSI 2014/2015 de l'EISTI
*/

/* Librairie node-postgres */
var pg = require('pg');

/* Client généré à la connexion à la base de données */
var client;

/* Fonction à appeler à l'aboutissement de chaque requête */
var done;

/* A MODIFIER SELON LES SETUPS : détails de la base de données */
var conn_client = "postgres://postgres:azerty@localhost/EEISTI-Inscriptions";

/**
* Connexion à la base de données : à appeler pour effectuer les requêtes
* @param callback function(err, client, done) : "err" l'erreur, "client" le client à manipuler pour les requêtes, "done" la fonction à appeler à chaque fin de requête
*/
module.exports.connect = function(callback) {
//	console.log("Connecting...");
	if (client) {
		client.end();
	}
	pg.connect(conn_client, function(err, pg_client, pg_done) {
		if (err) {
			callback("Database connection failed: "+conn_client+"\n"+err);
		} else {
			client = pg_client;
			done = pg_done;
			callback();
		}
	});
};

/**
* Déconnexion de la base de données : à appeler quand il n'y a plus de requêtes à effectuer
*/
module.exports.disconnect = function() {
//	console.log("Disconnecting...");
	done();
	pg.end();
};

/**
* Fonction asynchrone pour les requêtes à la base de données
* @param query_string String : Requête SQL à passer
* @param query_parameters Array of String : Liste de paramètres à escape (pour éviter les injections SQL, on met les String à tester sous ces paramètres, et ça évite de la merde, voilà)
* @param callback function(err, result) Fonction de callback : "err" étant l'erreur éventuelle, "result" étant le résultat SQL.
*/
module.exports.request = function(query_string, query_parameters, callback) {
//	console.log("Query: "+query_string);
	
	function answer(err, result) {
		if (err) {
			callback("Query: "+query_string+"\n"+err);
		} else {
			callback(null, result);
		}	
	}
	if (callback != undefined) {
		client.query(query_string, query_parameters, answer);
	} else {
		callback = query_parameters; /* Dirty function overloading handling */
		client.query(query_string, answer);
	}
};

/* GESTION DES TRANSACTIONS (TO DO) */

module.exports.transaction = {
	begin: function() {
	
	},
	rollback: function() {
	
	},
	commit: function() {
	
	}
};