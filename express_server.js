const express = require("express");
const app = express();
const PORT = 8080;

const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 6);
};

app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: true }));

let urlDatabase = [
  {id: "b2xVn2", longUrl: "http://www.lighthouselabs.ca"},
  {id: "9sm5xK", longUrl: "http://www.google.com"}
];

app.post("/urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {id: req.params.id, longUrl: "http://www.lighthouselabs.ca"};
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  res.render("urls_index.ejs", {urlDatabase: urlDatabase});
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

generateRandomString();