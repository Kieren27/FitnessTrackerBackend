const express = require('express');
const router = express.Router();
const { 
  getAllActivities, 
  getActivityByName, 
  createActivity, 
  updateActivity, 
  getActivityById,  
  getPublicRoutinesByActivity
} = require('../db');
const { requireUser } = require('./utils');

router.use((req, res, next) => {
    console.log("A request has been made to /activities");

    next();
})

router.get("/", async (req, res, next) => {
    try{
        const activities = await getAllActivities();  
        res.send(activities)
    } catch (error) {
        console.log(error);
        next(error);
    }
})


// POST /api/activities

router.post("/", requireUser, async (req, res, next) => {
    try {
      const { name, description } = req.body;
  
      // Check if an activity with the same name already exists
      const existingActivity = await getActivityByName(name);
      if (existingActivity) {
        return res.send({
          error: "ActivityExistsError",
          message: "An activity with name " + name + " already exists",
          name: "ActivityExistsError",
        });
      }
  
      // Create a new activity in the database
      const activity = await createActivity({ name, description });
  
      res.send(activity);
    } catch (error) {
      next(error);
    }
  });

//GET /api/activities/:activityId/routines

router.get("/:activityId/routines", async (req, res, next) => {
    try {
      const { activityId } = req.params;
      const activity = await getActivityById(activityId);
      if (!activity) {
         return res.status(404).json({          
          error: "ActivityNotFoundError",  
          message: "Activity " +activityId + " not found",
          name: "ActivtyNotFound"
       });
      }
  
      const routines = await getPublicRoutinesByActivity({id:activityId});
      res.send(routines);
    } catch (error) {
      next(error);
    }
  })

// PATCH /api/activities/:activityId
router.patch('/:activityId', requireUser, async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const { name, description } = req.body;
        // Check if the activity exists
        const existingActivity = await getActivityById(activityId);
        if (!existingActivity) {
            res.send({
              error: "ActivityNotFoundError",
              message: `Activity ${activityId} not found`,
              name: "ActivityNotFoundError",
          });
        }

        // Check if the new name already exists for another activity
        const activityWithSameName = await getActivityByName(name);
        if (activityWithSameName && activityWithSameName.id !== activityId) {
        res.send({
            error: "ActivityNameConflictError",
            message: "An activity with name " + name + " already exists",
            name: "ActivityNameConflictError",
        })
        }
        const updatedActivity = await updateActivity({id:activityId, name, description });
        res.send({ name: updatedActivity.name, id:parseInt(activityId), description: updatedActivity.description });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
