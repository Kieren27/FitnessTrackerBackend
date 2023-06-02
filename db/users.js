const client = require("./client");
const bcrypt = require('bcrypt');
// database functions

// user functions
async function createUser({ username, password }) {

  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  
    const {rows} = await client.query(`
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, hashedPassword])

    return rows;
  
  
}

async function getUser({ username, password }) {
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword);

  if(isValid){
    return user;
  }
}

async function getUserById(userId) {
  
    const {rows } = await client.query(`
    SELECT * FROM users
    WHERE id=$1;
    `, [userId])

    if (!rows.length){
      return null
    } else {
      delete rows[0].password;
      return rows[0];
    }
  
}

async function getUserByUsername(userName) {
const {rows: [user]} = await client.query(`
  SELECT *
  FROM users
  WHERE username = $1;
  
  `, [userName]);

  return user;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
