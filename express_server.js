/////////////////////////////////////////////////////////////////////
// Requires
/////////////////////////////////////////////////////////////////////

const express = require("express");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const {
  generateRandomString,
  urlsForUser,
  getUserByUsername,
  usernameSearch,
} = require("./helpers");

/////////////////////////////////////////////////////////////////////
// Initialization
/////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080;

/////////////////////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],

    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
);

/////////////////////////////////////////////////////////////////////
// Configuration
/////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");

/////////////////////////////////////////////////////////////////////
// "Database"
/////////////////////////////////////////////////////////////////////

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

/////////////////////////////////////////////////////////////////////
// Routes & Homepage
/////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////
// Urls
/////////////////////////////////////////////////////////////////////
app.get("/urls", (req, res) => {
  
  const templateVars = {
    urls: urlsForUser(req.session.userId, urlDatabase),
    userId: req.session.userId,
    username: users[req.session.userId]
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const username = req.session.userId;
  const longURL = req.body.longURL;
  const id = generateRandomString();
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

/////////////////////////////////////////////////////////////////////
// Urls/New & /Id
/////////////////////////////////////////////////////////////////////
app.get("/urls/new", (req, res) => {
  if (req.session.userId) {
    const templateVars = {
      userId: req.session.userId,
      username: users[req.session.userId],
    };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  if (req.session.userId) {
    const templateVars = {
      id,
      longURL: urlDatabase[id],
      username: users[req.session.userId]
    };
    
    res.render("urls_show", templateVars);
    
  } else {
    res.status(401).send("Unauthorized to Edit. Please Login");
  }
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

/////////////////////////////////////////////////////////////////////
// Urls/:id & /Delete
/////////////////////////////////////////////////////////////////////
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const username = req.session.userId;
  if (urlDatabase[id].userId === username) {
    delete urlDatabase[id];
    res.redirect("/urls");
  } else {
    res.status(403).send("Unauthorized to Delete. Please Login");
  }
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const username = req.session.userId;

  if (
    urlDatabase[id].userId === username
  ) {
    const longURL = req.body.longURL;
    urlDatabase[id].longURL = longURL;
    res.redirect("/urls");
  } else {
    res.status(400).send("Invalid");
  }
});

/////////////////////////////////////////////////////////////////////
// Login & Logout
/////////////////////////////////////////////////////////////////////
app.get("/login", (req, res) => {
  const username = users[req.session.userId];
  const templateVars = {
    username,
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const knowUser = getUserByUsername(username, users);

  if (!knowUser) {
    const templateVars = {
      status: 401,
      message: "Please Register if username or password is not created.",
      username: users[req.session.userId],
    };
    res.status(401).render("urls_error", templateVars);
  } else if (!bcrypt.compareSync(password, knowUser.password)) {
    const templateVars = {
      status: 401,
      message: "Incorrect username or password.",
      username: users[req.session.userId],
    };
    res.status(401).render("urls_error", templateVars);
  } else {
    req.session.userId = knowUser.userId;
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("/urls");
});

/////////////////////////////////////////////////////////////////////
// Registration
/////////////////////////////////////////////////////////////////////
app.get("/register", (req, res) => {
  const username = users[req.session.userId];
  const templateVars = {
    username: username,
  };
  if (templateVars.username) {
    templateVars["username"] = username;
  }
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // const knowUser = getUserByUsername(username, users);
  const newId = generateRandomString();
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = {
    id: newId,
    username: username,
    password: hash,
  };
  const userEmail = usernameSearch(username, users);

  if (user.username === "" || user.password === "") {
    res.status(400).send("Register with a vaild Username or Password");
  } else if (!userEmail) {
    users[newId] = user;
    req.session["userId"] = newId;
    res.redirect("/urls");
  } else {
    res.status(400).send("Please Login");
  }
});

/////////////////////////////////////////////////////////////////////
// Listener
/////////////////////////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
