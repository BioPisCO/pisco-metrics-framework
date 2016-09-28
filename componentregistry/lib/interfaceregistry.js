var fs = require('fs')
	,libxslt = require('libxslt')
	,libxmljs = require('libxmljs')
	,schemaconfig = require ('../config/configschema');

var SCH = require('./schema')
	,schema = new SCH();

/**
 * Object to manage all actions at the Registry Component as a middle layer.
 * @constructor
 */
var RegistryInterface = function () {
 
}


/**
 * RegistryInterface module.
 * @module lib/RegistryInterface
 */

RegistryInterface.prototype ={
  /**
 * Execute Component Registry.
 * @param {string} url - url of XSD remote file schema to validate.
 * @param {Requester~requestCallback} callback - Callback function (return true or false).
 * @memberOf  RegistryInterface
 */
 register: function (url, callback) {
  schema.verify(url, function (xmldata,verify){	
		console.log('schema verified: '+verify);
		if (verify) {
			schema.addcomponent( xmldata, function (add){
					if (add) {
						schema.createregistryHTML(function (created){
							return callback(created);
						});
					}
			});
		}
	 });
 },
 
 /**
 * Create registered components HTML from registry schema data.
 * @param {Requester~requestCallback} callback - Callback function (return true or false and msg execution).
 * @memberOf  RegistryInterface
 */
createregistryHTML: function (callback){

	var xhtml = schemaconfig.SCHEMAHTML;
	var encoding = 'utf8';

	var docSource = fs.readFileSync(schemaconfig.SCHEMAXML, encoding);  
	var stylesheetSource = fs.readFileSync(schemaconfig.SCHEMAXSL, encoding);

	var stylesheet = libxslt.parse(stylesheetSource);
	var result = stylesheet.apply(docSource);

	fs.writeFile(xhtml , result, encoding, function (err) {
				if (err) return console.log(err);
				else {console.log('data save into > ' + xhtml);}
	});

},

 
}
/** Make accessible module RegistryInterface */
module.exports = RegistryInterface;

 
