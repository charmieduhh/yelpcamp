const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground') //allows you to require index.js in seeds directory

mongoose.connect('mongodb://localhost:27017/yelp-camp', { //allows you to connect to mongoDB
    useNewUrlParser: true, //true = ensures app successfully connects
    useUnifiedTopology: true //true = uses new topology engine & removes support for several connection options that are no longer relevant with the new topology engine
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log('Database connected!')
});

//pick random element from an array
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
    }
    

const seedDB = async () => {
    await Campground.deleteMany({});
    //const c = new Campground({title: 'purple field'})
    //await c.save();
    for (let i=0; i < 50; i++) { //to loop over seed logic 50x
        const random1000 = Math.floor(Math.random() * 1000); //takes random city/1000
        const price = Math.floor(Math.random() * 15) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`, //takes random city, state
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251', //generates a diff image for the same campground
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea aliquam esse voluptates quam nam. Eum itaque possimus nisi laudantium autem hic repudiandae, sapiente quae provident pariatur non ducimus nam quas.',
            price
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close(); //closes db connection
});
 


