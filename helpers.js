const generateRandomString = function () {
  return Math.random().toString(36).substring(2, 8);
};

const urlsForUser = (id, urlDatabase) => {
  const urlsUser = {};
  for (const shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].user === id) {
      urlsUser[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return urlsUser;
};

module.exports = { generateRandomString, urlsForUser};