const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  
    const {rows: [activity]} = await client.query(`
    INSERT INTO activities(name, description)
    VALUES ($1, $2)
    RETURNING *;
    
    `, [name, description])
  
  return activity;
}

async function getAllActivities() {
  const {rows} = await client.query(
    `SELECT *
    FROM activities;`
  )
  return rows;
}

async function getActivityById(id) {
  try{
  const {rows: [activity]} = await client.query(`
  SELECT * 
  FROM activities
  WHERE id=$1;
  
  `, [id])

  if (!activity){
    throw{
      name: 'ActivityNotFoundError',
      message: 'Could not find an activity with that id'
    }
  }

  return activity;
} catch (error){
  console.error (error);
}

}

async function getActivityByName(name) {

  try {

    const { rows: [activity] } = await client.query(`
    SELECT * 
    FROM activities
    WHERE name=$1;
    `, [name])

    if (!activity){
      throw{
        name: 'ActivityNotFoundError',
        message: 'Could not find an activity with that name'
      }
    }

    return activity;
  } catch (error){
    console.error (error);
  }
}


async function attachActivitiesToRoutines(routines) {
  try{
    const promises = await Promise.all(routines.map(async(routine) => {
      const {rows: activities} = await client.query(`
        SELECT activities.*, 
               routine_activities.count, 
               routine_activities.duration, 
               routine_activities.id AS "routineActivityId"
        FROM activities
        JOIN routine_activities ON routine_activities."activityId" = activities.id
        WHERE routine_activities."routineId"=$1;
      `, [routine.id]);

      routine.activities = activities;
      return routine;
    }));

    return promises;
  } catch (error){
    throw error
  }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `${key}=$${index + 1}`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }
  console.log("setString ", setString);


  try {
    const { rows: [activity] } = await client.query(`
      UPDATE  
        activities
      SET
        ${setString}
      WHERE
        id=${id}
      RETURNING *;
    `, Object.values(fields));

    console.log("activity: ", activity);

    return activity;
  } catch (error) {
    console.error (error);
  }
}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
