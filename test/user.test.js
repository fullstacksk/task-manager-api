const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    setDatabase
} = require('../test/fixtures/db')

beforeEach(setDatabase)

//Should signup a new user
test('Should create a new user', async () => {
    const response = await request(app).post('/users').send({
        name: "shailendra Kumar",
        email: "sksahil08876@gmil.com",
        password: "shailendra@123",
        age: 20
    }).expect(201)

    //Assert that database was changed successfully
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response

    expect(response.body).toMatchObject({
        user: {
            name: "shailendra Kumar",
            email: "sksahil08876@gmil.com"
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('shailendra@123')
})


// Should not signup user with invalid name/email/password
test('Should not signup user with invalid name/email/password', async () => {
    const response = await request(app).post('/users').send({
        name: 786, //invalid name
        email: "sksahil08876@gmil@com", //invalid email
        password: "shailendra@123",
        age: 20
    }).expect(400)

})
//Should login a user
test('Should login a user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

//logging in second user
test('Should login  userTwo', async () => {
    const response = await request(app).post('/users/login').send({
        email: userTwo.email,
        password: userTwo.password
    }).expect(200)
    const user = await User.findById(userTwoId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

//should not login by entering wrong password
test('Should Not log in a user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'itsmypassw'
    }).expect(400)
})

//should fetch user profile
test('should get my profile', async () => {
    const response = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
})

//should not fetch user profile if unauthorised
test('Should not get profile for unauthorised user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

//should delete user if authorized
test('Should delete account for authorised user', async () => {
    await request(app)
        .delete('/users/deleteAccount')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

// Should not delete user if unauthenticated
test('Should not delete account for unauthorized user', async () => {
    await request(app)
        .delete('/users/deleteAccount')
        .send()
        .expect(401)
})

//should upload avatar if authorized
test('Should upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

// Should update user if unauthenticated
test('Should update authorised user profile', async () => {
    await request(app)
        .patch('/users/editProfile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Ramjatan Kumar"
        }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('Ramjatan Kumar')

})

// Should not update user if unauthenticated
test('Should not update authorised user profile', async () => {
    await request(app)
        .patch('/users/editProfile')
        .send({
            name: "Ramjatan Kumar"
        }).expect(401)

    const user = await User.findById(userOneId)
    expect(user.name).toBe('sksahil')

})

// Should not update user with invalid name/email/password
test('Should not update by invalid fileld', async () => {
    await request(app)
        .patch('/users/editProfile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Shailendra Kumar Roy',
            location: 'Kanakarbagh Patna-20'
        }).expect(400)
})