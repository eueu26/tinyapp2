const express = require("express");
const app = express();
const PORT = 8080;

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};

app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.post("urls/:id/delete", (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const shortId = req.params.id;
  const longURL = urlDatabase[shortId].longURL;
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);
  
  const id = req.body.longURL;
  const newId = generateRandomString();
  urlDatabase[newId] = {
    newId: id,
  };
  res.redirect(`/urls/${newId}`);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {id: req.params.id, longURL: "http://www.lighthouselabs.ca"};
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase };
  res.render("urls_index.ejs", templateVars);
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
