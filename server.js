const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 3000;
const User = require("./models/userModel");
const Order = require("./models/orderModel");

const store = new MongoDBStore({
    mongoUrl: 'mongodb://localhost/a4',
    collection: 'sessions'
});

store.on('error', (error) => {console.log(error)});

// set up
app.set("views");
app.set('view engine','pug');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    name: 'a4-session',
    secret: 'the chicken is crossing the road',
    cookie: {
        maxAge: 1000*60*60*24*7,
    },
    store: store,
    resave: true,
    saveUninitialized: false,
}));

// print out methods
app.use(function(req,res,next){
    console.log(`${req.method} for ${req.url}`);
    next();
});

// set up middleware
app.use(exposeSession);
app.get(['/','/home'],(req,res) => res.render('home'));

app.get('/login',(req,res) => res.render('login'));
app.post('/login',login);
app.get('/logout',logout);

app.get("/users", loadUsers);
app.get("/users/:uid", loadUser);
app.put("/users/:uid", updateUser);

app.get('/register',(req,res) => res.render('register'));
app.post("/register", registerUser);

app.post("/order", addOrder);
app.get("/order/:oid", showOrder);
app.get("/order", showOrderForm);

// checks if user is logged in before allowing access to order form
function showOrderForm(req,res,next) {
    if (!req.session.loggedin) {
        res.status(401).send("you cannot access this without logging in");
    } else {
        res.render('orderform');
    }
}
// responsd with a rendered html from pug template of the order
function showOrder(req,res,next){
    // get the requested order id from paramters
    let requested_oid = req.params.oid;

    // look for the requested order
    Order.find({_id : requested_oid}, function(err,found_order) {
        if (err) {
            throw err;
        } 
        // order is found
        else if (typeof found_order[0] !== "undefined") {
            // find the user who ordered that 
            User.find({username:found_order[0].user_who_ordered}, function(err,found_user){
                if (err) {
                    throw err;
                }else {
                    // check if the person/session logged in is equal to orderer of that order the or if the privacy of that user who ordered it is false
                    if (req.session.userId ==  found_user[0]._id || found_user[0].privacy == false) {
                        res.render('order',{order: found_order[0]});
                    } else {
                        res.status(403).send("not allowed access");
                    }
                }

            });
        }
        else{
            // send when order is not found
            res.status(404).send("Order not found");
        }
    });

   
}

// add order to database
function addOrder(req,res,next) {
    // find the user who submitted the order
    User.find({ _id: req.session.userId }, function (err, result) {
        if (err) {
            throw err;
        }
        // user exists
        else if (typeof result !== "undefined") {
            // create new order and fill in details
            let o = new Order();
            // grab user name of the session user
            o.user_who_ordered = result[0].username;
            o.restaurantID = req.body.restaurantID;
            o.restaurantName = req.body.restaurantName;
            o.subtotal = req.body.subtotal;
            o.total = req.body.total;
            o.fee = req.body.fee;
            o.tax = req.body.tax;
            o.order = req.body.order;

            // save the order and update the user, with the new order id to their list of orders
            o.save(function(err, result1){
                if(err){
                    console.log(err);
                    res.status(500).send("Error creating Order");
                    return;
                }
                // update the order given id
                User.findByIdAndUpdate(req.session.userId,{$push: {"orders": o._id}},
                {safe: true, upsert: true},
                function(err, user) {
                    if (err) {
                        console.log(err);
                    }
                    // give the okay signal
                    res.status(200).send("Order saved");
                });
            });
        }
    });   
}

// updates a user's privacy settings
function updateUser(req,res,next){
    // put the id and privacy into an object for passing into update
    
    let updated_privacy = (req.body.privacy === 'true');

    User.find({ _id: req.params.uid }, function (err, result) {
        // if user tries to change settings that arent their or they arent logged in, reject request
        if (req.session.userId != req.params.uid || !req.session.loggedin){
            res.status(403).send("Cannot change privacy");
        }
        // other wise update
        else if (req.session.userId == req.params.uid) {
            let update = {
                orders: result[0].orders,
                username: result[0].username,
                password: result[0].password,
                privacy: updated_privacy,
            }
            let requested_id = {'_id': req.params.uid};
            User.findOneAndUpdate(requested_id, update, {upsert: true}, function(err, doc) {
                if (err) return res.send(500, {error: err});
                // send back ok signal
                return res.status(200).send('Succesfully saved');
            });
        }
        // catch anything that doesn't work
        else {
            res.status(403).send("Cannot change privacy");
        }
    });
}

// loads a single user
function loadUser(req,res,next) {
    // get requested uid from parameter
    let requested_id = req.params.uid;
    // look for the user
    User.find({ _id: requested_id }, function (err, result) {
        // dont allow private content to be shown
        if (req.session.userId != requested_id && result[0].privacy == true){
            res.status(403).send("Cannot access private content");
        }
        // if the privacy is public or the user is the same as requested
        else if (req.session.userId == requested_id || result[0].privacy == false) {
            res.render('user',{orders: result[0].orders, username: result[0].username, user: result[0]});
        }
        // just to catch anything that falls through
        else {
            res.status(403).send("Cannot access private content");
        }
    });
}

// registers a user into the database
function registerUser(req, res, next){
    // gets credentials from body
    let users_name = req.body.username;
    let users_password = req.body.password;

    // looks to see if a user is already registered under that name
    User.find({ username: users_name }, function (err, result) {
        if(err) throw err;
        if (typeof result[0] !== "undefined") {
            res.status(401).send('user already exists');
        } 
        else {
            // create new user with those credentials and save
            let u = new User();
            u.username = users_name;
            u.password = users_password;
            u.privacy = false;
            u.save(function(err, result){
                if(err){
                    console.log(err);
                    res.status(500).send("Error creating user.");
                    return;
                }
                // log the newly created user in and redirect them
                req.session.loggedin = true;
                req.session.username = u.username;
                req.session.userId = u._id;
        
                res.locals.session = req.session;
                res.status(200).redirect('/home');
            })
           
        }
        return;
    });     
}

// finds list of users who match query search
function loadUsers(req, res, next){
    // get query
    let users_name = req.query.name;

    // there is a search query 
    if(typeof users_name !== "undefined")
    {
        // look for users who match that using regex
        User.find({privacy: false, username:{$regex: users_name, $options : 'i'}}, function (err, result) {
            if(err) throw err;
            req.app.locals.users = result;
            res.status(200).render('users');
            return;
        });  
    } else {
        // no search query so do a default find
        User.find({privacy: false}, function (err, result) {
            if(err) throw err;
            req.app.locals.users = result;
            res.status(200).render('users');
            return;
        });  
    }
}

// from workshop- did not end up using this
function auth (req,res,next) {
    if (!req.session.loggedin) {
        res.status(401).send("you cannot access this without logging in");
    } else {
        next();
    }
}

function login(req,res,next){
    // check if user is already logged in
    if (req.session.loggedin) {
        return res.status(200).send('Already logged in');
    }
    // grab from request
    let users_name = req.body.username;
    let users_password = req.body.password;

    // find the user before updating session data using mongodb/mongoose
    User.find({ username: users_name }, function (err, result) {
        if(err) throw err;
        // user exists
        if (typeof result[0] !== "undefined") {
            // if password does not match
            if (users_password != result[0].password) {
                res.status(401).send('incorrect password');
            }
            else {
                // change session to logged in and redirect user
                req.session.loggedin = true;
                req.session.username = result[0].username;
                req.session.userId = result[0]._id;
        
                res.locals.session = req.session;

                res.status(200).redirect('/home');
            }
        } 
        else {
            res.status(401).send('User not found');
        }
        return;
    });      
}

// destroys session and redirects user when they logout
function logout(req,res){
    req.session.destroy();
    delete res.locals.session;
    res.redirect('/home');
}

// exposes session for routers (I did not end up using routers)
function exposeSession(req,res,next){
    if (req.session) res.locals.session = req.session;
    next();
}

// connect mongoose to the server
mongoose.connect('mongodb://localhost/a4',{useNewUrlParser:true, useUnifiedTopology: true});
let db = mongoose.connection;
db.on('error',console.error.bind(console, 'Error connecting to the database'));
db.once('open', function() {
    User.init(()=>{
        startServer();
    });
});
function startServer() {
    app.listen(PORT, ()=> console.log(`server listening on http://localhost:${PORT}/`));
}