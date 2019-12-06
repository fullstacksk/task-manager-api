const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})



// const me = new User({
//     name: "Shailendra Kumar",
//     email: "sksahil@GMAIL.COm",
//     password: "sahil@raj",
//     age: 21
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error.message)
// })

// const myTask = new Task({
//     taskName: "readBooks",
//     taskDesc: "Read Rich Dad Poor Dad",
//     completed: true
// })

// myTask.save().then(() => {
//     console.log(myTask)
// }).catch((error) => {
//     console.log(error.message)
// })

// const Task = mongoose.model('Task', {
//     taskName: {
//         type: String
//     },
//     desc: {
//         type: String
//     },
//     completed: {
//         type: Boolean
//     }
// })

// const myTask = new Task({
//     taskName: "writeCode",
//     desc: "Write the code to add two numbers",
//     completed: true
// })

// myTask.save().then(() => {
//     console.log(myTask)
// }).catch((error) => {
//     console.log(error._message)
// })