const express = require('express');
const routinesRouter = express.Router();

const { 
    getAllPublicRoutines,
    createRoutine,
    getRoutineById,
    updateRoutine,
    destroyRoutine
 } = require('../db');
const { requireUser } = require('./utils');

// GET /api/routines
routinesRouter.get('/', async (req, res, next) => {
    try {
        const routines = await getAllPublicRoutines();

        res.send(routines);
    } catch ({ name, message }) {
        next({ name, message });
    }
});
// POST /api/routines
routinesRouter.post('/', requireUser, async (req, res, next) => {
    const { isPublic, name, goal } = req.body;

    const routineData = {};
    try {
        routineData.creatorId = req.user.id;
        routineData.name = name;
        routineData.goal = goal;
        routineData.isPublic = isPublic;

        const newRoutine = await createRoutine(routineData);

        res.send(newRoutine);
    } catch ({ name, message }) {
        next({ name, message });
    }
});
// PATCH /api/routines/:routineId
routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { isPublic, name, goal } = req.body;

    try {
        const originalRoutine = await getRoutineById(routineId);
        const { id } = originalRoutine;

        if (originalRoutine.creatorId === req.user.id) {
            const updatedRoutine = await updateRoutine({ id, isPublic, name, goal });
            res.send(updatedRoutine);
        } else {
           res.status(403).json({
            error: "Unauthorized User",
            name: "UnauthorizedUserError",
            message: `User ${req.user.username} is not allowed to update ${originalRoutine.name}`
           });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});
// DELETE /api/routines/:routineId
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;

    try {
        const routineToBeDeleted = await getRoutineById(routineId);

        if (routineToBeDeleted.creatorId === req.user.id) {
            const deletedRoutine = await destroyRoutine(routineToBeDeleted.id);
            res.send(deletedRoutine);
        } else {
            res.status(403).json({
                error: "Unauthorized User",
                name: "UnauthorizedUserError",
                message: `User ${req.user.username} is not allowed to delete ${routineToBeDeleted.name}`
               });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});
// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
