const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");
const {getUserByUsername} = require('./users');

// shruthi
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {rows: [routine]} = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING "creatorId", "isPublic", name, goal, id;
    
    
    `, [creatorId, isPublic, name, goal])


    delete routine.password;

    return routine;
  } catch (error){
    throw error;
  }

}

//shruthi
async function getRoutineById(id) {

<<<<<<< HEAD
try{
  const {rows: [routine]} = await client.query(`
=======
    return routine;
  } catch (error) {
    console.error("Can't get Routine by ID, err");
    throw error;
  }
}
>>>>>>> ff57506 (Finished Routine_Activities)

  SELECT *
  FROM routines
  WHERE id=$1;
  `, [id])


  return routine;
  
} catch(error){
  throw error;
}


}



//shruthi
async function getRoutinesWithoutActivities() {
  try {
    const {rows: [routines]} = await client.query(`
    SELECT *
    FROM routines
    `)

    return routines;
  } catch (error) {
    throw error;
  }
<<<<<<< HEAD

}

=======
}
>>>>>>> ff57506 (Finished Routine_Activities)

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      JOIN users u
      ON r."creatorId" = u.id;
    `);

    const allRoutines = await attachActivitiesToRoutines(routines);
    return allRoutines;

  } catch (error) {
    console.error('Error getting all routines: ', error);
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: publicRoutines } = await client.query(`
      SELECT u.username AS "creatorName", r.*
      FROM routines r
      INNER JOIN 
      users u ON r."creatorId" = u.id
      WHERE  r."isPublic" = true;
    `);

    const allPublicRoutines = await attachActivitiesToRoutines(publicRoutines);
    return allPublicRoutines;

  } catch (error) {
    console.error("Error catching all Public Routines:", error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try{ 
    const { rows: routines } = await client.query(`
      SELECT routines.*
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE users.username = $1;
    `, [username]);
    
    const routinesWithActivities = await attachActivitiesToRoutines(routines);
    return routinesWithActivities;

  } catch(error){    
    console.error("Error getting routines by user", error);
    throw error;
  }
}



async function getPublicRoutinesByUser({ username }) {

  try{
    
    /* const {rows: [routines]} = await client.query(
      `SELECT users.username, 
      routines.name, 
      routine_activities.duration, 
      routine_activities.count,
      routines.id,
      routines."isPublic"
      FROM users
      JOIN routines
      ON users.id = routines."creatorId"
      JOIN routine_activities
      ON "routineId" = routines.id
      WHERE routines."isPublic" = true
      AND users.username = $1;
      `, [username])

      */

      
      /* const { rows: [routines]} = await client.query(`
      SELECT routines.*
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE users.username = $1
      AND routines."isPublic" = true;
    `, [username]);

    */

    const {rows: [user]} = await client.query
      (`SELECT id
      FROM users
      WHERE users.username=$1
      `, [username])
    

    const {rows: routines} = await client.query(`
      SELECT *
      FROM routines
      WHERE "isPublic" = true
      AND "creatorId" = $1
    
    `, [user.id])
    
   console.log(routines)
    return routines;


    

      
      
  
  } catch (error) {
    throw error;

  }


}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
