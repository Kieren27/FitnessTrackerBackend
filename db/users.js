const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

  try {
    const { rows: [user] } = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, hashedPassword])

    delete user.password;

    return user;
  } catch (error) {
    console.error (error);
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT *
    FROM users
    WHERE username = $1;
    `, [userName]);

    console.log("getUserByUsername ", user);
    return user;
  } catch (error) {
    console.error (error);
    
  }
}

async function getUser({ username, password }) {

  try {
    const user = await getUserByUsername(username);
    console.log("user ", user);
    console.log("password ", password);
    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (isValid) {
      delete user.password;
      return user;
    } else {
      throw Error("Username or password is incorrect");
    }

  } catch (error) {
    console.error (error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM users
      WHERE id=$1;
    `, [userId])

    if (!rows.length) {
      return null
    } else {
      delete rows[0].password;
      return rows[0];
    }
  } catch (error) {
    console.error (error);
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}