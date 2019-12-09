const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')
const userOneId = new mongoose.Types.ObjectId
const userOne = {
    _id: userOneId,
    name: "sksahil",
    email: "fullstacksk@gmail.com",
    password: "whataboutyou",
    tokens: [{
        token: jwt.sign({
            _id: userOneId
        }, process.env.JWT_SECRET)
    }]
}
const userTwoId = new mongoose.Types.ObjectId
const userTwo = {
    _id: userTwoId,
    name: "Shailendra Kumar",
    email: "sksuman250299@gmail.com",
    password: "whataboutyou",
    tokens: [{
        token: jwt.sign({
            _id: userOneId
        }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId,
    taskName: "firstTask",
    taskDesc: "This is my first task.",
    completed: false,
    owner: userOneId
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId,
    taskName: "secondTAsk",
    taskDesc: "This is my second task.",
    completed: true,
    owner: userOneId
}
const taskThird = {
    _id: new mongoose.Types.ObjectId,
    taskName: "thirdTask",
    taskDesc: "This is my third task.",
    completed: false,
    owner: userTwoId
}
const setDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(userOne).save()
    await new User(userTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThird).save()
}

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThird,
    setDatabase
}