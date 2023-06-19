const express = require('express');
const routinesRouter = express.Router();

const { 
    getAllPublicRoutines,
    createRoutine,
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

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
