var express = require('express')
	,bodyParser = require('body-parser');
var IR = require('../lib/interfaceregistry')
	,interfaceregistry = new IR();
	
var app = express();

app.use(express.static("../public")); //put accesible public directory and its sub directories
app.set('views',  '../views'); //put accesible views

app.disable('etag');

var hbs = require('hbs');//Handlebars
app.set('view engine', 'html'); //we can tell Express to treat HTML files as dynamic by using the "view engine"
app.engine('html', hbs.__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//***Show all the components registered and let us to register a new component**/
app.get('/register', function(req, res) {
	interfaceregistry.createregistryHTML();
	res.render('registry.html');
});

//*** registry component acction send from /register***//
app.post('/registercomponent', function(req, res) {
  //res.send('You sent the URL "' + req.body.schema + '".');
  interfaceregistry.register(req.body.schema, function (response){
  	if(response) { res.redirect('/register'); }
  	else  {res.send('There was a problem with the component registration.');}
  });
});

app.listen(8082, function() {
  console.log('Server running at http://127.0.0.1:8082');
})


