var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'crud'
});
connection.connect(function(error){
	if(error) {
		console.log(error);
	} else {
		console.log('Database Connected');
		connection.query('SELECT * FROM employee', function (error, result){
			if(error){
				console.log('Error excuting the query - ${error}');
			}
			else{
				console.log("Result: ", result);
		}
		})
	}
});

module.exports = connection;