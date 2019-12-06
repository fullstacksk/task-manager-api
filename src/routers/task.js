const express = require('express')
const Task = require('../models/task')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

//creating task
router.post('/tasks', auth, async (req, res) => {
    try {
        // const task = new Task(req.body)
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }
})

//getting tasks 
//GET /tasks?completed=true
//GET /tasks?limit=2
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    try {
        const match = {}
        const sort = {}
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        if (!req.user.tasks) {
            throw new Error({
                error: "No tasks found"
            })
        }
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
})

//getting specific task by _id
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        //const task = await Task.findById(_id)
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send({
                error: "Doc Not Found"
            })
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})


//Updating task
router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['taskName', 'taskDesc', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid Updates"
        })
    }
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

        if (!task) {
            return res.status(404).send({
                error: "No Doc Found"
            })
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)

    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
})


//Deleting task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if (!task) {
            return res.status(404).send({
                error: "No DOc Found"
            })
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Delete All Task
router.delete('/tasks/deleteAll', auth, async (req, res) => {
    try {
        const user = req.user
        const tasks = await Task.deleteMany({
            owner: user._id
        })
        // if (!tasks) {
        //     throw new Error({
        //         error: "No tasks found!"
        //     })
        // }
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
        console.log(e)
    }
})


module.exports = router