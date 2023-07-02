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
  if (req.session.userId) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});


/////////////////////////////////////////////////////////////////////
// Urls
/////////////////////////////////////////////////////////////////////
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlsForUser(req.session.userId, urlDatabase),
    username: users[req.session.userId],
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const username = req.session.userId;
  const id = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[id] = { longURL: longURL, userId: username };
  res.redirect(`/urls/${id}`);
});

/////////////////////////////////////////////////////////////////////
// Urls/New & /Id
/////////////////////////////////////////////////////////////////////
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: users[req.session.userId],
  };
  if (!templateVars.user) {
    res.redirect("/login");
    return;
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
    const templateVars = {
      id,
      longURL: urlDatabase[id].longURL,
      username: users[req.session.userId],
    };
    res.render("urls_show", templateVars);
  } else {
    return res.status(400).send("The id does not match with a longURL");
  }
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id]) {
    const longURL = urlDatabase[id].longURL;
    res.redirect(longURL);
  } else {
    return res.status(400).send("Unknown longURL");
  }
});


/////////////////////////////////////////////////////////////////////
// Urls/:id & /Delete
/////////////////////////////////////////////////////////////////////
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const username = req.session.userId;
  if (username) {
    delete urlDatabase[id];
    res.redirect("/urls");
  } else {
    return res.status(400).send("Unauthorized to delete.");
  }
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const username = req.session.userId;
  if (username) {
    const usernameURL = urlsForUser(username, urlDatabase);
    if (usernameURL[id]) {
      urlDatabase[id].longURL = req.body.longURL;
      res.redirect("/urls");
    } else {
      return res.status(400).send("Invalid");
    }
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

  if (knowUser && bcrypt.compareSync(password, knowUser.password)) {
    req.session.userId = knowUser.userId;
    res.redirect("/urls");
  } else {
    return res
      .status(401)
      .send(`Credentials Invalid. Username or Password is Incorrect`);
  }
});

app.post("/logout", (req, res) => {
  res.session.userId = null;
  req.redirect("/urls");
});


/////////////////////////////////////////////////////////////////////
// Registration
/////////////////////////////////////////////////////////////////////
app.get("/register", (req, res) => {
  if (req.session.userId) {
    res.redirect("/urls");
    return;
  }
  const username = users[req.session.userId];
  const templateVars = {
    username: username,
  };
  res.render("urls_register", templateVars);
});


app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const knowUser = getUserByUsername(username, users);

  if (username && password) {
    if (!knowUser) {
      const id = generateRandomString();
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      const newUser = {
        id: id,
        username: username,
        password: hash,
      };
      users[id] = newUser;
      res.redirect("/urls");
    } else {
      return res.status(400).send("Username already exists");
    }
  } else {
    return res
      .status(400)
      .send("username or password is incorrect. Please try again.");
  }
});


/////////////////////////////////////////////////////////////////////
// Listener
/////////////////////////////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
