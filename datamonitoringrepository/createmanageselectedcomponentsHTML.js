var fs = require('fs');
var libxslt = require('libxslt');
var libxmljs = require('libxmljs');  
var xhtml = './views/manageselectedcomponents.html';
var encoding = 'utf8';

var docSource = fs.readFileSync('../ComponentsRegistry/schema/registryschema.xml', encoding);  
var stylesheetSource = fs.readFileSync('./schema/registrytoselectedcomponents.xsl', encoding);

var stylesheet = libxslt.parse(stylesheetSource);
var result = stylesheet.apply(docSource);

//console.log(result);

fs.writeFile(xhtml , result, encoding, function (err) {
			if (err) return console.log(err);
			else {console.log('data save into > ' + xhtml);}
});	



// stylesheet.apply(docSource, function(err, result){
//     // result is now a libxmljs document containing the result of the transformation
//     if(err){console.log(err);}
//     console.log('result: '+result);
// });





