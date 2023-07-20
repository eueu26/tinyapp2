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

const getUserByEmail = (email, users) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return undefined;
};


const existEmail = (email, users) => {
  for (let user in users) {
    if (email === users[user].email) {
      return true;
    }
  }
};

const getIdOfUser = (id, users) => {
  const user = users[id];
  if (user) {
    return user;
  }
  return undefined;
};



module.exports = { generateRandomString, urlsForUser, getUserByEmail,  existEmail, getIdOfUser};