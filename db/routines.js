const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal ) 
      VALUES($1, $2, $3, $4) 
      RETURNING *;
    `, [ creatorId, isPublic, name, goal ]);
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
      SELECT * 
      FROM routines
      WHERE id = $1;
    `, [id]);

    return routine;
  } catch (error) {
    console.error("Can't get Routine by ID, err");
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const {rows} = await client.query(`
      SELECT * FROM routines
      WHERE id NOT IN (
        SELECT DISTINCT "routineId" 
        FROM routine_activities
      )
    `);

    return rows;
  } catch (error) {
    console.error('Error getting routines without activities');
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      JOIN users u
        ON r."creatorId" = u.id;
    `);

   

    const allRoutines = await attachActivitiesToRoutines(routines);
<<<<<<< HEAD

    const routinesMapped = await Promise.all(allRoutines.map(async(routine) => {
      await routine.activities.map(async(activity) => {
        activity.routineId = routine.id;
        const {rows: [activityInfo]} = await client.query(`
        SELECT duration, count
        FROM routine_activities
        WHERE "activityId" = $1
      `, [activity.id])
      

        activity.duration = await activityInfo.duration;
    
        activity.count = await activityInfo.count;
       
        
        return activity;
      })
      console.log(routine)
      return routine;
    }
    )
    )
    ;
    return routinesMapped;
=======
    // console.log(allRoutines);
    return allRoutines;
>>>>>>> 361cfab61132f42bfebfe7862729151f82a4ce5f

  } catch (error) {
    console.error('Error getting all routines: ', error);
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: publicRoutines } = await client.query(`
    select
      u.username AS "creatorName" 
    , r.*
    FROM routines r
    INNER JOIN users u
    ON r."creatorId" = u.id
    WHERE r."isPublic" = true;
    `);

    const allPublicRoutines = await attachActivitiesToRoutines(
      publicRoutines
    );
    return allPublicRoutines;
  } catch (error) {
    console.error("Error getting all Public Routines" ,error);
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
<<<<<<< HEAD
  try{ 
     /* const { rows: routines } = await client.query(`
      SELECT routines.*
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE users.username = $1;
    `, [username]);
    
    const routinesWithActivities = await attachActivitiesToRoutines(routines);
    return routinesWithActivities;

    */

    // trying different approach

    const routines = await getAllRoutines();
    console.log(routines)
    //return routines.filter(routine => routine.creatorName === username)

  } catch(error){    
    console.error("Error getting routines by user", error);
=======
  try{
    const {rows:routines } = await client.query(`
      SELECT r.*, u.username 
      AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id 
      WHERE u.username = $1;   
      `
    , [username]);
    const getAllRoutinesByUser = await attachActivitiesToRoutines(routines);
      return getAllRoutinesByUser;

  }
  catch(error){    
    console.log("Error getting routines by user", error);
>>>>>>> 361cfab61132f42bfebfe7862729151f82a4ce5f
    throw error;
  }
}


async function getPublicRoutinesByUser({ username }) {
  try{
<<<<<<< HEAD
    
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

    
    
   

    

      
      
  
  } catch (error) {
    throw error;
=======
    const {rows:routines } = await client.query(`
      SELECT r.*, u.username AS "creatorName"
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id   
      WHERE r."isPublic" = true and u.username = $1;
      `
    , [username]);
    const publicRoutinesByUser = await attachActivitiesToRoutines(routines);
      return publicRoutinesByUser;
>>>>>>> 361cfab61132f42bfebfe7862729151f82a4ce5f

  }
  catch(error){    
    console.log("Error getting public routines by user", error);
    throw error;
  }

}

async function getPublicRoutinesByActivity({ id }) {
  try{
    const {rows: publicRoutinesByActivity } = await client.query(
    `
      SELECT u.username as "creatorName", r.*
      FROM routines r
      INNER JOIN users u
      ON r."creatorId" = u.id
      WHERE r."isPublic" = true;
      `
    );
      const activityPublicRoutines = await attachActivitiesToRoutines(publicRoutinesByActivity);

      const idActivityPublicRoutines = activityPublicRoutines.filter(obj=> {
        return obj.activities.some(activity => {
          return activity.id == id
        })
      })

      return idActivityPublicRoutines
  }
  catch(error){    
    console.log("Error getting Public Routines By Activity", error);
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {

  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      const { rows: [updatedRoutine] } = await client.query(`
        UPDATE routines
        SET ${setString}
        WHERE id = $${Object.keys(fields).length + 1}
        RETURNING *;
      `, [...Object.values(fields), id]);

      return updatedRoutine;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

}

async function destroyRoutine(id) {
  try {
    await client.query(
      `DELETE FROM routine_activities
      WHERE "routineId" = $1;`
    , [id]);

    // Delete the routine
    const result = await client.query(
      `DELETE FROM routines
      WHERE id = $1;`
    , [id]);

    if (result.rowCount === 0) {
      throw new Error('Routine not found');
    }

    console.log('Routine successfully deleted');
  } catch (error) {
    console.error('Error while deleting routine', error);
    throw error;
  }
}


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
