const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

// shruthi
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {rows: [routine]} = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    
    
    `, [creatorId, isPublic, name, goal])

    return routine;
  } catch (error){
    throw error;
  }

}

//shruthi
async function getRoutineById(id) {}


//shruthi
async function getRoutinesWithoutActivities() {}


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



async function getPublicRoutinesByUser({ username }) {}

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
