const express = require('express')
const morgan = require('morgan')
const passportSetup = require('./config/passport')
const mongoose = require('mongoose');
const keys = require('./config/keys')
const cookieSession = require('cookie-session');
const passport = require('passport');

const app = express()
const port = 3000



// set up view engine
app.set('view engine', 'ejs')

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey]
}))

// initialize passport
app.use(passport.initialize())
app.use(passport.session())

// connect mongoDB
mongoose.connect(keys.db.dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(conn => console.log(`MongoDB Connected: ${conn.connection.host}`)).catch(err => console.log(err.reason));


// logging
app.use(morgan('dev'))


// set up routes
app.use('/auth', require('./routes/auth-routes'))
app.use('/profile', require('./routes/profile-routes'))

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});



app.get('/', (req, res) => res.render('home'))
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))


