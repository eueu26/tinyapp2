const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

let urlDatabase = [
  {id: "b2xVn2", longUrl: "http://www.lighthouselabs.ca"},
  {id: "9sm5xK", longUrl: "http://www.google.com"}
];


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

app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});