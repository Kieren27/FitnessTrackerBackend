const express = require('express');
const routineActivitiesRouter = express.Router();

const { 
    updateRoutineActivity,
    canEditRoutineActivity,
    getRoutineActivityById,
    getRoutineById,
    destroyRoutineActivity,
} = require('../db');
const { requireUser } = require("./utils");

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration} = req.body;

    console.log("routineActivityId: ", routineActivityId);

    try {
       const canEdit = await canEditRoutineActivity(routineActivityId, req.user.id);

       const activityToUpdate = await getRoutineActivityById(routineActivityId);
       const { id, routineId } = activityToUpdate;
       const routine = await getRoutineById(routineId);

       if (canEdit) {
        const updatedRoutineActivity = await updateRoutineActivity({id, count, duration});
        res.send(updatedRoutineActivity);
       } else {
        res.status(403).json({
            error: "Unauthorized User",
            name: "UnauthorizedUserError",
            message: `User ${req.user.username} is not allowed to update ${routine.name}`
        });
       }
    } catch ({ name, message }) {
        next({ name, message });
    }
});
// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;

    try {
        const canEdit = await canEditRoutineActivity(routineActivityId, req.user.id);

        const routineActivityToDelete = await getRoutineActivityById(routineActivityId);
        console.log("routineActivityToDelete: ", routineActivityToDelete);
        const { routineId } = routineActivityToDelete;
        const routine = await getRoutineById(routineId);

        if (canEdit) {
            const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId);
            res.send(deletedRoutineActivity);
        } else {
            res.status(403).json({
                error: "Unauthorized User",
                name: "UnauthorizedUserError",
                message: `User ${req.user.username} is not allowed to delete ${routine.name}`
            });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});
module.exports = routineActivitiesRouter;
