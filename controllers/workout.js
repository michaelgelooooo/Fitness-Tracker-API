const Workout = require('../models/Workout');
const { errorHandler } = require("../auth");


module.exports.createWorkout = (req, res) => {
    let newWorkout = new Workout({
        userId: req.user.id,
        name: req.body.name,
        duration: req.body.duration
    });

    return newWorkout.save()
        .then(savedWorkout => {
            return res.status(201).send(savedWorkout);
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.getUserWorkouts = (req, res) => {
    return Workout.find({ userId: req.user.id })
        .then(workouts => {
            return res.status(200).send({
                workouts: workouts
            });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.updateWorkout = (req, res) => {
    let updatedWorkout = {
        name: req.body.name,
        duration: req.body.duration
    };

    return Workout.findOneAndUpdate(
        { _id: req.params.workoutId, userId: req.user.id },
        updatedWorkout,
        { new: true, runValidators: true }
    )
        .then(workout => {
            if (!workout) {
                return res.status(404).send({
                    error: "Workout not found"
                });
            }

            return res.status(200).send({
                message: "Workout updated successfully",
                workout: workout
            });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.deleteWorkout = (req, res) => {
    return Workout.findOneAndDelete({
        _id: req.params.workoutId,
        userId: req.user.id
    })
        .then(workout => {
            if (!workout) {
                return res.status(404).send({
                    error: "Workout not found"
                });
            }

            return res.status(200).send({
                message: "Workout deleted successfully"
            });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.completeWorkout = (req, res) => {
    return Workout.findOneAndUpdate(
        {
            _id: req.params.workoutId,
            userId: req.user.id,
            status: "pending"
        },
        { status: "completed" },
        { new: true, runValidators: true }
    )
        .then(workout => {
            if (!workout) {
                return res.status(404).send({
                    error: "Workout not found or already completed"
                });
            }

            return res.status(200).send({
                message: "Workout status updated successfully",
                workout: workout
            });
        })
        .catch(error => errorHandler(error, req, res));
};