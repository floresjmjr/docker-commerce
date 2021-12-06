/* eslint-disable max-len */
const express = require('express');
const app = express();
const PORT = 3000;
const Handlebars = require('handlebars');
const {create} = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


const hbs = create({handlebars: allowInsecurePrototypeAccess(Handlebars)});

app.engine('handlebars', hbs.engine);
Handlebars.registerHelper('isdefined', function(value) {
  return typeof value != 'undefined';
});

app.set('view engine', 'handlebars');

// // User global variable setup
// app.locals.user = null;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use('/', require('./routes'));

app.listen(PORT, ()=>{
  console.log(`Server is listening on http://localhost:${PORT}`);
});
