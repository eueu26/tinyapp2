const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = [
  {shortId: "b2xVn2", longUrl: "http://www.lighthouselabs.ca"},
  {shortId: "9sm5xK", longUrl: "http://www.google.com"}
];

app.get("/urls", (req, res) => {
  res.render("urls_index.ejs", {urlDatabase: urlDatabase});
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});