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

const getUserByUsername = (username, users) => {
  let knowUser = null;
  for (const userId in users) {
    const user = users[userId];
    if (user.username === username) {
      knowUser = user;
    }
  }
  return knowUser;
};


module.exports = { generateRandomString, urlsForUser, getUserByUsername};