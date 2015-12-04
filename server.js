var path = require('path');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quote_board');
var QuoteSchema = new mongoose.Schema({
	name: String,
	quote: String,
	created_at: { type: Date, default: Date.now } 
});

QuoteSchema.path('name').required(true);
QuoteSchema.path('quote').required(true);

var Quote = mongoose.model('Quote', QuoteSchema);
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res){
	res.render('index');
})

app.get('/errors', function(req, res){
	res.render('errors');
})

app.get('/quotes', function(req, res){
	Quote.find({}, function(err, quotes){
	res.render('quotespage', {x:quotes});
	})
})

app.post('/quotes', function(req, res){
	console.log('POST DATA', req.body);
	var quote = new Quote({name: req.body.name, quote: req.body.quote});
	quote.save(function(err){
		if(err){
			console.log('something went wrong');
			res.redirect('/errors')
		}
		else{
			console.log('succesfully added quote');
			res.redirect('/quotes');
		}
	})
})


app.listen(8000, function(){
	console.log('listening on port 8000')
})



