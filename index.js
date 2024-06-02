const express = require('express');
const session = require('express-session');
const nocache = require('nocache');
const app = express();

// Set up express-session middleware
app.use(nocache());
app.use(session({
  secret: 'secret_key', 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//credentials 
let userInfo = {
  email: "user123@gmail.com",
  password: "123456"
};

app.use(express.static("./public"));
//check  the user is loggedin or not
function checkAuth(req, res, next) {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect('/');
  }
}
//if user is loggedin then redirect to the dashboard
app.get("/", (req, res) => {
  if (req.session.userLoggedIn) {
    res.redirect("/dashboard");
  } else {
    res.render('login',{errorMessage:''});
  }
});

//dashboard rendering
app.get("/dashboard", checkAuth, (req, res) => {
  res.render('dashboard',{email:''});
});

//check the email and password
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === userInfo.email && password === userInfo.password) {
  
    req.session.userLoggedIn = true;
    req.session.email=email
    res.render('dashboard',{email:email});
  } else {
     res.render('login', { errorMessage: 'Invalid email or password.' });
  }
});

//when the user loggedOut the session will delete
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.redirect('/dashboard'); 
    } else {
      res.redirect('/');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
