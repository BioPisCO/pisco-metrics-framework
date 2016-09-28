var express = require('express')
	,bodyParser = require('body-parser')
	,xml2js = require('xml2js');
var IR = require('../lib/interfacemonitoring')
	,interfacemonitoring = new IR();




var app = express();
app.use(express.static("../public")); //put accesible public directory and its sub directories
app.set('views',  '../views'); //put accesible views


var hbs = require('hbs');//Handlebars
app.set('view engine', 'html'); //we can tell Express to treat HTML files as dynamic by using the "view engine"
app.engine('html', hbs.__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


/**
  * Express: Fast, unopinionated, minimalist web framework for Node.js 
  * @external express
 */

/** Create HTML page to manage the all components properties that will be include in Selected Components */
app.get('/managecomponents', function(req, res) {
	interfacemonitoring.createselectedcomponentsHTML(function(msg,response){
		if(!response) console.log(msg);
		else {console.log(msg);res.render('managecomponents.html');}
	}); 
	
});

/**  Redirect and show the HTML page with the selected components created in /managecomponents */
app.get('/selectedcomponents', function(req, res) {
	res.render('selectedcomponents.html');
});

/** Render install components actions
 * This is functionality is under development
 */
app.post('/install', function(req, res) {
  //res.send('You sent the URL "' + req.body.schema + '".');
  interfacemonitoring.install(function (msg,response){
  	if(response) {
		console.log(msg);
		res.render("selectedcomponents", {data: msg}); //it is not necessary to add .html because we are using engine hbs html
	}
  	else  {res.send(msg + '\nThere was a problem with the components instalation.');}
  });
});

/** Render run components action
 * This is functionality is under development
 */

app.post('/run', function(req, res) {
  //res.send('You sent the URL "' + req.body.schema + '".');
  interfacemonitoring.run();
  var msg = 'runing components...\n';
  res.render("selectedcomponents", {data: msg}); //it is not necessary add .html because we are using engine hbs html
});


/** Create selectedcomponents.XML from manageselectedcomponents action */
app.post('/createselectedcomponentsXML', function(req, res) {
	var selectedcomponents = JSON.parse(req.body.componentsinput);
	//console.log(req.body.componentsinput);
	interfacemonitoring.createselectedcomponentsXML(selectedcomponents, function(msg,response){
		if(response) {res.redirect('/selectedcomponents');}
		else{res.send(msg);}
	});
	
});

/** Create the available HTML page to manage the available components */
app.get('/availablecomponents', function(req, res) {
	interfacemonitoring.createavailablecomponentsHTML(function(msg,response){
		if(!response) console.log(msg);
		else {console.log(msg);res.render('availablecomponents');}
	}); 
	
});

/** Render action metric detail from available components
 * Show the graphics for each metric associated with an available components list
 */
app.post('/metricdetail', function(req, res) {
	var idcomponent = req.body.idcomponent;
	var name = req.body.name;
	var description = req.body.description; 
	var datestart = req.body.datestart;
	var dateend = req.body.dateend;
	var resourcename = req.body.resourcename;
	var resourcetype = req.body.resourcetype;

	var date = formatdate(new Date()); 
	if (typeof datestart == 'undefined'){datestart = date;} 
	if (typeof dateend == 'undefined'){dateend = date;}
	interfacemonitoring.graphicComponentsdata(idcomponent,datestart,dateend,function (resources, xlabels, ytitle, title, response){
		if(resources === null){res.render('availablecomponents.html');}
		else{
			if(response){
				res.render('metricdetail', { idcomponent: idcomponent, name: name, description: description, resourcename: resourcename, 
													  datestart: datestart, dateend: dateend, resourcetype: resourcetype, 
													  data: JSON.stringify(resources), xlabels: JSON.stringify(xlabels), 
													  ytitle: JSON.stringify(ytitle), title: JSON.stringify(title) } );
			}
			else {res.send('There is a problem with this action'); res.render('availablecomponents.html');} 
		}
	});//end showComponent
	
});

/** Render action metrics detail from available components
 * Show the graphics for a group of metric-resource associated with an available components list
 */
app.get('/monitoringallmetrics', function(req, res) {
	if(res){ 
		if(typeof req.query.selectedmetrics == 'undefined'){
			interfacemonitoring.getAvailableComponents(function(result,response){
				if(!response){res.render('error reading available components.')}
				else{
					res.render('monitoringallmetrics', { metrics: result });
				}
			});
		}else{
			var idsselectedcomponents = JSON.parse(req.query.selectedmetrics);
			var datestart = req.query.datestart;
			var dateend = req.query.dateend; 
			var grouptype = req.query.grouptype;
			var date = formatdate(new Date());
			if (datestart == ''){datestart = date;} 
			if (dateend == ''){dateend = date;} 
			interfacemonitoring.graphicComponentbygroup(idsselectedcomponents, grouptype, datestart, dateend,
			 function (resources,xlabels,ytitle,title,response){
				if(response) {
					res.send(resources);
				}
				else{console.log('error in monitoringallmetrics');}
			});
		} // else typeof end
	}
	else{res.send('There is a problem reading available components');}
});

/** Init server and listen in port */
app.listen(8083, function() {
  console.log('Server running at http://127.0.0.1:8083');
})



/**
* Return the current date in a string format 
* @param {Object} date - current date.
* @returns {string}
*/
function formatdate(date){
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
		
	month<10 ? month='0'+month : month=month;
	day<10 ? day='0'+day : day=day;
	
	return (year+'-'+month+'-'+day);
	 

}




