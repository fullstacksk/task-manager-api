// CRUD Operations

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const {
    MongoClient,
    ObjectID
} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

//const id = new ObjectID()
// console.log(id)
// console.log(id.id)
// console.log(id.getTimestamp())
// console.log(id.toHexString())
// console.log(id.toHexString().length)


MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error, client) => {
    if (error) {
        return console.log("OOPS!!! Unable to connect database!")
    }
    const db = client.db(databaseName)

    db.collection('tasks').deleteOne({
        taskName: "noOne"
    }).then((result) => {
        console.log(result.deletedCount)
    }).catch((error) => {
        console.log(error)
    })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateOne({
    //     _id: new ObjectID("5dd63a8593fffd066859b0e8")
    // }, {
    //     $set: {
    //         taskName: "doProject",
    //         desc: "Make project with nodejs."
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // const updatePromise = db.collection('tasks').update({
    //     _id: new ObjectID("5dd63bec30f7f81278b65db1")
    // }, {
    //     $set: {
    //         taskName: "writeCode",
    //         desc: "Write some code."
    //     }
    // })

    // updatePromise.then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection("tasks").find({
    //     taskName: "readBooks"
    // }).toArray((error, result) => {
    //     if (error) {
    //         return console.log("Unable to find records")
    //     }
    //     console.log(result)
    // })

    // db.collection('tasks').findOne({
    //     taskName: "readBooks"
    // }, (error, user) => {
    //     if (error) {
    //         return console.log(error)
    //     }
    //     console.log(user)
    // })

    // db.collection('tasks').insertOne({
    //     taskName: "readBooks",
    //     desc: "To read all the books",
    //     completed: false
    // })

    // db.collection('task').insertOne({
    //     taskName: 'washClothes',
    //     desc: "To wash out the dirty colthes",
    //     completed: true
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user!')
    //     }
    //     console.log(result.ops)
    // })

    // db.collection('tasks').insertMany([{
    //     taskName: "writeNotes",
    //     desc: "Write a note",
    //     completed: "true"
    // }, {
    //     taskName: "takeMedicine",
    //     desc: "To take medicine on time",
    //     completed: false
    // }, {
    //     taskName: "readBooks",
    //     desc: "To read some books",
    //     completed: true
    // }], (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert multiple lines!")
    //     }
    //     console.log(result.ops)
    // })
})