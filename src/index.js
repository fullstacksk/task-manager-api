const app = require('./app')
const port = process.env.PORT
//setting port
app.listen(port, () => {
    console.log("server is up on port ", port)
})

//FILE upload
// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         //file.originalname.endsWith('.jpg')
//         //file.originalname.match(/\.(jpg|jpeg)$/)
//         if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
//             cb(new Error("Please upload an image."))
//         }
//         cb(undefined, true)
//     }
// })

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({
//         error: error.message
//     })
// })

// const jwt = require('jsonwebtoken')

// const pet = {
//     name: "kalu",
//     age: 3
// }
// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
//     // const task = await Task.findById('5de4bec2dea9362e6853bd58')
//     // await task.populate('owner').execPopulate()
//     // console.log(task)
//     const user = await User.findById('5de4be38dea9362e6853bd55')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()
// pet.toJSON = function () {
//     const pet = this
//     const petObject = pet
//     // delete petObject.age
//     // delete petObject.name
//     petObject.color = "yellow"
//     return petObject
// }
// console.log(JSON.stringify(pet))

// const myFunction = async () => {
//     const token = jwt.sign({
//         _id: 'abc123'
//     }, 'thisismycourse')
//     console.log(token)

//     const data = jwt.verify(token, 'thisismycourse')
//     console.log(data)
// }

// myFunction()

//BCRYPT LIBRARY
//C:\Users\SK-PC\AppData\Roaming\npm-cache\_logs
// const bcrypt = require('bcrypt')

// const myFunction = async function () {
//     const password = "sksahil@123"
//     const hashedPassword = await bcrypt.hash(password, 8)
//     console.log("password", password)
//     console.log('hashedPassword', hashedPassword)

//     const isMatch = await bcrypt.compare('sksahil@123', hashedPassword)
//     return isMatch
// }

// myFunction().then(result => {
//     console.log(result)
// }).catch(e => {
//     console.log(e)
// })


// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are currently disabled.')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send({
//         error: 'ERROR 503! The website is under maintainance. Try back soon!'
//     })
// })