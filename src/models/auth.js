const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { client } = require("../config/redis");


const signUp = (body, hashPassword) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const created_at = new Date(Date.now());
    const { email, role_id } = body;
    const sqlQuery =
      "INSERT INTO users(id, email, password, role_id, created_at) VALUES($1, $2, $3, $4, $5) RETURNING email, role_id";
    db.query(sqlQuery, [id, email, hashPassword, role_id, created_at])
      .then((result) => {
        resolve(result.rows);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const getPassByEmail = async (email) => {
  try {
    const result = await db.query(
      'select u.*,r.role  from users u inner join "role" r on u.role_id  = r.id where email = $1',
      [email]
    );
     if(result.rowCount === 0) throw {msg : "Email or password is incorrect"}
        return result.rows[0]
  } catch (error) {
    throw { error };
  }
};

const editPassword = async (id, hashPassword)=>{
  try {
      const result = await db.query('update users set password = $1 where id = $2', [hashPassword, id])
      return result.rows[0]
  } catch (error) {
      console.log(error);
      throw {error}
  }
}
module.exports = { getPassByEmail, signUp, editPassword};
