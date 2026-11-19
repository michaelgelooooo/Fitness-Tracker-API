const express = require('express');
const workoutController = require("../controllers/workouts");
const { verify } = require("../auth");


const router = express.Router();


module.exports = router;