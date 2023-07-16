const generateRandomString = function () {
  return Math.random().toString(36).substring(2, 8);
};

const urlsForUser = (id, urlDatabase) => {
  const urlsUser = {};
  for (const shortUrl in urlDatabase) {
    urlsUser[shortUrl] = urlDatabase[shortUrl];
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

const usernameSearch = (username, users) => {
  for (let user in users) {
    if (username === users[user].username) {
      return username;
    }
  }
  return undefined;
};



module.exports = { generateRandomString, urlsForUser, getUserByUsername, usernameSearch};