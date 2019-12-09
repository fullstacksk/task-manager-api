const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThird,
    setDatabase
} = require('./fixtures/db')

beforeEach(setDatabase)

//should create task if user is authorized
test('Should create a task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            taskName: "readBankoKaMayajal",
            taskDesc: "We have to read BankoKaMayajal"
        }).expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

// Should fetch user task by id if unauthenticated
test('Should get all task of userone', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body.length).toEqual(2)
})

// Should not fetch user task by id if unauthenticated
test('Should get all task of userone', async () => {
    const response = await request(app)
        .get('/tasks')
        .expect(401)
})

// Should not create task with invalid description/completed
test('Should not create task with invalid field values', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            taskName: "readBankoKaMayajal",
            taskDesc: false,
            completed: "We have to read BankoKaMayajal"
        }).expect(400)
})

// Should update task with valid description/completed
test('Should update task by authorised user', async () => {
    const response = await request(app)
        .patch(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            taskDesc: "This is my second task which is updated jsut now"
        }).expect(200)

    const taskUpdated = await Task.findById(taskTwo._id)
    expect(taskUpdated.taskDesc).toEqual('This is my second task which is updated jsut now')
})

// Should not update task with invalid description/completed
test('Should not update task with invalid fields', async () => {
    const response = await request(app)
        .patch(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            taskDesc: true,
            completed: "This is my second task which is updated again jsut now"
        }).expect(500)
})

// Should not update other users task
test('Should not update other users task', async () => {
    const response = await request(app)
        .patch(`/tasks/${taskThird._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            taskDesc: "This is my second task which is updated again jsut now",
            completed: true
        }).expect(404)
})

//Should not delete another user's task
test('Testing delete task security', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskThird._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)

    const taskThree = await Task.findById(taskThird._id)
    expect(taskThree).not.toBeNull()
})

// Should not fetch other users task by id
test('Should not fetch other users task by id', async () => {
    const response = await request(app)
        .get(`/tasks/${taskThird._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(404)
})

// Should fetch only completed tasks
test('Should fetch only completed tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=true')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body).not.toBeNull()
})

// Should fetch only incomplete tasks
test('Should fetch only incomplete tasks', async () => {
    const response = await request(app)
        .get('/tasks?completed=false')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body).not.toBeNull()
})

// Should sort tasks by description/completed/createdAt/updatedAt
test('Should sort tasks by description', async () => {
    const response = await request(app)
        .get('/tasks?sortBy=taskDesc:desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body).not.toBeNull()
})

// Should fetch page of tasks
test('Should fetch page of tasks', async () => {
    const response = await request(app)
        .get('/tasks?limit=2')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    expect(response.body).not.toBeNull()
})
// Should delete task if unauthenticated
test('Shoild delete user task if authorised', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    expect(response.body).not.toBeNull()
})

// Should not delete task if unauthenticated
test('Shoild delete user task if authorised', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskTwo._id}`)
        .expect(401)
})