var ghdownload = require('github-download');
var DB = require('./database');
var npm = require("npm");
var exec = require('child_process').exec;
/**
 * Object to admin Components.
 * @constructor
 */
var Component = function () {}

/**
 * Component module.
 * @module lib/Component
 */

Component.prototype ={
 /**
 * Install the component and dependencies
 * @param {string} url - repository link where the component is stored.
 * @param {Object[]} dependencies - list of component dependencies.
 * @param {string} path - path where the component will be stored.
 * @param {Requester~requestCallback} callback - Callback function (return true or false).
 * @memberOf  Component
 */
  
  install: function (url,dependencies,path,callback) {
   
	ghdownload(url, path)
		.on('dir', function(dir) {
		  console.log(dir)
		})
		.on('file', function(file) {
		  console.log(file);callback(false);
		})
		.on('zip', function(zipUrl) { //only emitted if Github API limit is reached and the zip file is downloaded 
		  console.log(zipUrl)
		})
		.on('error', function(err) {
		  callback(err,false); 
		  console.error(err);
		})
		.on('end', function() {
			//console.log( url + ' download into ' + path +' completed' );
			var msg = url + ' download into ' + path +' completed\n';
			installdependencies(dependencies,callback,msg);	
		})
 },
 
 
  /**
 * Execute an specific component
 * @param {string} executable - Executable path file.
 * @param {Object[]} params - list of params used in the execution.
 * @param {JSON} resourceobject - resource to store into db.
 * @param {Requester~requestCallback} callback - Callback function (return true or false and value of this execution).
 * @memberOf  Component
 */
 run: function (executable,params,resourceobject,callback){
 	var component = this;
 	var command = 'node ' + executable;
 	params = params[0].parameter;
 	params.forEach(function(param, i) {
 		command += ' \"' + param + '\" ';
 	});//end forEach
 	console.log(new Date()+'---> Run command: ' + command);
 	exec(command, function(error, stdout, stderr) {	
		console.log('stdout: ' + stdout); 
		if (error !== null) {
			callback('exec error: ' + error,false);
		}else{
			var value = stdout.replace(/[^0-9]/g, "");
			if(value == ''){value = 0;}
			var date = new Date();
			var fulldate = date;//date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
			resourceobject.frequencies[0].value = value; 
			resourceobject.frequencies[0].date = fulldate;
			component.insert(resourceobject, callback);
		}
		
	});	
 },
  /**
 * Insert specific component data into db
 * @param {JSON} resource - new resource.
 * @param {Requester~requestCallback} callback - Callback function (return true or false and value of this execution).
 * @memberOf  Component
 */
 insert: function (resource, callback){
 	var db = new DB();
 	db.insert(resource, callback);
 	
 	
 }
 
}
/** Make accessible module Component */
module.exports = Component;

/**
 * Install every dependence associated with a component
 * @param {Object[]} dependencies - list of component dependencies.
 * @param {Requester~requestCallback} callback - Callback function (return true or false and value of this execution).
 * @param {string} msg - string message with the results of this instalation
 */
function installdependencies(dependencies, callback,msg) {
	var inserted = 0;
    var libraries = dependencies[0].library;
	msg += 'installing dependencies...\n';
	libraries.forEach(function(library, i) {
		var library = libraries[i];
		//console.log('installing library '+library);
		npm.load(function (err) {
		  if (err){ console.log(err); return callback(err,false);}
		  npm.commands.install([library], function (err, data) {
			if (err) { console.log(err); return callback(err,false);}
			//console.log('Library '+library+' installed');
			msg += 'Library '+library+' installed' + '\n';
			if (++inserted == libraries.length) { callback(msg,true);} //control asynchronous iteration
		  });
		  npm.registry.log.on("log", function (message) { 
			// console.log('installing library '+msg);}
		  });
		})//end npm.load
	});//end forEach
}


