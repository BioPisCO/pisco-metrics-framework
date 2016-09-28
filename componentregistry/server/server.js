var express = require('express')
	,bodyParser = require('body-parser');
var IR = require('../lib/interfaceregistry')
	,interfaceregistry = new IR();
	
var app = express();

app.use(express.static("../public")); //make accesible public directory and its sub directories
app.set('views',  '../views'); //make accesible views

app.disable('etag');

var hbs = require('hbs');//Handlebars
app.set('view engine', 'html'); //we can tell Express to treat HTML files as dynamic by using the "view engine"
app.engine('html', hbs.__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // support URL-encoded bodies
  extended: true
}));

/**
  * Express: Fast, unopinionated, minimalist web framework for Node.js 
  * @external express
 */


 /** Register a new component and shows all the components registered */
app.get('/register', function(req, res) {
	interfaceregistry.createregistryHTML();
	res.render('registry.html');
});

/** Registry component acction sent from /register */
app.post('/registercomponent', function(req, res) {
  //res.send('You sent the URL "' + req.body.schema + '".');
  interfaceregistry.register(req.body.schema, function (response){
  	if(response) { res.redirect('/register'); }
  	else  {res.send('There was a problem with the component registration.');}
  });
});

/**  Init server and listen in port */
app.listen(8082, function() {
  console.log('Server running at http://127.0.0.1:8082');
})


