/////////////////////////////////////////////////////////////////////
// Requires
/////////////////////////////////////////////////////////////////////

const express = require("express");
const cookieParser = require("cookie-parser");

/////////////////////////////////////////////////////////////////////
// Initialization
/////////////////////////////////////////////////////////////////////

const app = express();
const PORT = 8080;

/////////////////////////////////////////////////////////////////////
// Requires
/////////////////////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/////////////////////////////////////////////////////////////////////
// Configuration
/////////////////////////////////////////////////////////////////////

app.set("view engine", "ejs");

/////////////////////////////////////////////////////////////////////
// Listener
/////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/////////////////////////////////////////////////////////////////////
// "Database"
/////////////////////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const generateRandomString = function () {
  return Math.random().toString(36).substring(2, 8);
};

/////////////////////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////////////////////

// app.get("/set-cookies", (req, res) => {
//   res.cookie("Cookie 1", 1);
//   res.cookie("Cookie number two", "abc");
//   res.cookie("Another Cookie ", "1234 dog");

//   res.render("set-cookie");
// });

// app.get("/read-cookie", (req, res) => {
//   const cookies = req.cookies;
//   const templateVars = {
//     cookies: cookies,
//   };
//   res.render("read-cookie", templateVars);
// });

// app.post("/sign-out", (req, res) => {
//   res.clearCookie("username");
//   res.redirect("/urls");
// });


// // app.get("/login", (req, res) => {
// //   const templateVars = { Username: users[req]
// //   }
// // })

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   if (username) {
//     res.cookie("username", username);
//     return res.redirect(`/urls`);
//   }
// });

// app.post("urls/:id/delete", (req, res) => {
//   const id = req.params.id;
//   delete urlDatabase[id];
//   res.redirect("/urls");
// });

// app.get("/u/:id", (req, res) => {
//   const shortId = req.params.id;
//   const longURL = urlDatabase[shortId].longURL;
//   res.redirect(longURL);
// });

// app.post("/urls", (req, res) => {
//   const id = req.body.longURL;
//   const newId = generateRandomString();
//   urlDatabase[newId] = {
//     newId: id,
//   };
//   res.redirect(`/urls/${newId}`);
// });

// app.get("/urls/new", (req, res) => {
//   res.render("urls_new");
// });

app.get("/urls/:id", (req, res) => {
  const shortID = req.params.id;
  const templateVars = {id: shortID, longURL: urlDatabase[shortID]};
  res.render("urls_show", templateVars);
});


app.get("/urls", (req, res) => {
  const templateVars = {  urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});
