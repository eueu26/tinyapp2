/////////////////////////////////////////////////////////////////////
// Requires
/////////////////////////////////////////////////////////////////////

const express = require("express");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const {
  generateRandomString,
  urlsForUser,
  findEmailExist,
  findPasswordExist,
  findIdOfEmail,
  getIdOfUser,
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

const urlDatabase = {};

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
  const userId = req.session.userId;
  const user = getIdOfUser(userId, users);
  if (!user) {
    return res.status(401).send("Please Login");
  } else {
    const templateVars = {
      urls: urlsForUser(userId, urlDatabase),
      userId: userId,
      user: users[userId],
    };
    res.render("urls_index", templateVars);
  }
});

app.post("/urls", (req, res) => {
  const userId = req.session.userId;
  const longURL = req.body.longURL;
  const id = generateRandomString();
  if (getIdOfUser(userId, users)) {
    urlDatabase[id] = { longURL, userId: userId };

    res.redirect(`/urls/${id}`);
  } else {
    return res.status(401).send("Unauthorized access. Please Login");
  }
});

/////////////////////////////////////////////////////////////////////
// Urls/New & /Id
/////////////////////////////////////////////////////////////////////
app.get("/urls/new", (req, res) => {
  const userId = req.session.userId;
  const templateVars = {
    user: users[userId],
  };
  if (!userId) {
    res.send("Please Login");
  } else {
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
  const userId = req.session.userId;
  const id = req.params.id;
  if (!urlDatabase[id]) {
    res.status(404).send("This URL does not exist");
  }
  if (urlDatabase[id].userId === userId) {
    const templateVars = {
      id,
      longURL: urlDatabase[id].longURL,
      user: users[userId],
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(401).send("Please Login");
  }
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (urlDatabase[id] === undefined) {
    return res.status(404).send("URL not found.");
  }
  const longURL = urlDatabase[id].longURL;
  console.log("longURL", longURL);
  console.log("id", id);
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
    let longURL = req.body.longURL;
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
  const userEmail = findEmailExist(email, users);
  const userPassword = findPasswordExist(email, users);
  if (email === userEmail) {
    if (bcrypt.compareSync(password, userPassword)) {
      const userId = findIdOfEmail(email, users);
      req.session.userId = userId;
      res.redirect("/urls");
    } else {
      res.status(403).send("Wrong Password Please Try again");
    }
  } else {
    res.status(401).send("Unauthorized access Please Register");
  }
});

app.post("/logout", (req, res) => {
  req.session.userId = null;
  res.redirect("/login");
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
  const userEmail = findEmailExist(email, users);

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
