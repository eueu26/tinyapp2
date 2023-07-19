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
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  const templateVars = {
    urls: urlsForUser(req.session.userId, urlDatabase),
    userId: req.session.userId,
    user: users[req.session.userId],
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.session.userId) {
    res.status(401).send("Unauthorized access. Please Login");
  } else {
    const longURL = req.body.longURL;
    const id = generateRandomString();
    urlDatabase[id] = {longURL, userId: req.session.userId};
    res.redirect(`/urls/${id}`);
  }
});

/////////////////////////////////////////////////////////////////////
// Urls/New & /Id
/////////////////////////////////////////////////////////////////////
app.get("/urls/new", (req, res) => {
  if (req.session.userId) {
    const templateVars = {
      userId: req.session.userId,
      user: users[req.session.userId],
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
      longURL: urlDatabase[id].longURL,
      user: users[req.session.userId],
    };

    res.render("urls_show", templateVars);
  } else {
    res.status(401).send("Unauthorized to Edit. Please Login");
  }
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id] === undefined) {
    return res.status(404).send("URL not found.");
  }
  const longURL = urlDatabase[id].longURL;

  res.redirect(longURL);
});

/////////////////////////////////////////////////////////////////////
// Urls/:id & /Delete
/////////////////////////////////////////////////////////////////////
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const user = req.session.userId;
  if (urlDatabase[id].userId === user) {
    delete urlDatabase[id];
    res.redirect("/urls");
  } else {
    res.status(403).send("Unauthorized to Delete. Please Login");
  }
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const user = req.session.userId;

  if (urlDatabase[id].userId === user) {
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
  const user = users[req.session.userId];
  const templateVars = {
    user,
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const knowUser = getUserByUsername(email, users);

  if (!knowUser) {
    const templateVars = {
      status: 401,
      message: "Please Register if email or password is not created.",
      user: users[req.session.userId],
    };
    res.status(401).render("urls_error", templateVars);
  } else if (!bcrypt.compareSync(password, knowUser.password)) {
    const templateVars = {
      status: 401,
      message: "Incorrect email or password.",
      user: users[req.session.userId],
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
  const user = users[req.session.userId];
  const templateVars = {
    user: user,
  };
  if (templateVars.user) {
    templateVars["user"] = user;
  }
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Register with a vaild Email or Password");
  }

  const newId = generateRandomString();
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = {
    id: newId,
    email: email,
    password: hash,
  };
  const userEmail = usernameSearch(email, users);

  if (!userEmail) {
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
