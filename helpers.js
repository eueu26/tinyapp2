const generateRandomString = function () {
  return Math.random().toString(36).substring(2, 8);
};

const urlsForUser = (id, urlDatabase) => {
  const urlsUser = {};
  for (const shortUrl in urlDatabase) {
    if (id === urlDatabase[shortUrl].userId) {
      urlsUser[shortUrl] = urlDatabase[shortUrl];

    }
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


const getIdOfUser = (id, users) => {
  const user = users[id];
  if (user) {
    return user;
  }
  return undefined;
};

const findEmailExist = (email, users) => {
  for (let user in users) {
    if (email === users[user].email) {
      return email;
    }
  }
  return undefined;
};


const findPasswordExist = (email, users) => {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user].password;
    }
  }
  return undefined;
};


const findIdOfEmail = (email, users) => {
  for (let user in users) {
    if (email === users[user].email) {
      return users[user].id;
    }
  }
  return undefined;
};



module.exports = { generateRandomString, urlsForUser, findEmailExist, findPasswordExist, findIdOfEmail, getIdOfUser, getUserByEmail};