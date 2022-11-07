const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override'); //don't forget to download using npm i method-override
const Campground = require('./models/campground'); //allows you to require campground.js
const process = require('process');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { //allows you to connect to mongoDB
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('Database connected!')
});

const app = express();

app.engine('ejs', ejsMate); //tells express to use ejsMate instead of default one on ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) 
app.use(express.urlencoded({extended: true })) //parses req.body for POST & PUT requests
app.use(methodOverride('_method')) //_method = string used for query string

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})
    
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => { //where new campground is submitted to
    const campground = new Campground(req.body.campground); //bc {"campground":{"title":["Camp Wimbleton","San Diego, CA"]}}
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`) //after submitting new campground, redirects new campground to homepage
})

app.get('/campgrounds/:id', async (req, res) => { //allows you to look up corresponding campground w id
    const { id } = req.params
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id); //looks up campground by ID
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => { //use PUT to submit edited data to the right page
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}); // campground from schema ---> {title: 'afdf', location: 'adsfa'}
    // ... means campground is spread into req.body
    res.redirect(`/campgrounds/${campground.id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

app.listen(3000, () => {
    console.log('SERVING FROM PORT 3K!')
})