var fs = require('fs');
var MG = require('./lib/managementgraphics.js');
var libxslt = require('libxslt');
var libxmljs = require('libxmljs'); 
var jstoxml = require("js2xmlparser");


var managementgraphics = new MG(); 
var xml2js = require('xml2js');
var xhtml = 'views/availablecomponents.html';
var encoding = 'utf8';

var docSource = fs.readFileSync('schema/availablecomponents.xml', encoding);  
var stylesheetSource = fs.readFileSync('schema/availablecomponents.xsl', encoding);
var stylesheet = libxslt.parse(stylesheetSource);


var parser = new xml2js.Parser();
parser.parseString(docSource, function (err, result) {
	 if (err) {console.log(err);} 
	 for(var index in result.availablecomponents.component) {
			var idcomponent = String(result.availablecomponents.component[index].id); 
			(function(index){
				managementgraphics.getMonitoringrecordnumber(idcomponent, function(records,response){
					if(!response) {callback(null,false);}
					else{result.availablecomponents.component[index]['records'] = records;}
					if (parseInt(index)+1 == Object.keys(result.availablecomponents.component).length) { //control asynchronous iteration
							var xmlresult = jstoxml("availablecomponents",result.availablecomponents);	
							var htmlresult = stylesheet.apply(xmlresult);
							fs.writeFile(xhtml , htmlresult, encoding, function (err) {
								if (err) return console.log(err);
								else {console.log('data save into > ' + xhtml);}
							});// fs end
					} //if end to control asynchronous iteration
				}); // managementgraphics end

			}(index));// function end
			
	 }// for end
});







