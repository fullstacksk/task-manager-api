const express = require('express')
const User = require('../models/user')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const multer = require('multer')
const {
    sendWelcomeEmail,
    sendCancellationEmail
} = require('../email/account')
const router = new express.Router()


//Log In
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
        console.log('You are logged in!')
    } catch (e) {
        res.status(500).send(e)
    }
})

//Sign Up
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        res.status(200).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send({
            error: e.message
        })
    }
})

//My profile
router.get('/users/me', auth, async (req, res) => {
    try {
        const user = req.user
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
})

//Log Out
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


//Log Out from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Update My Profile
router.patch('/users/editProfile', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid Updates"
        })
    }
    try {
        const user = req.user
        //const user = await User.findById(req.params.id)
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

        if (!user) {
            return res.status(404).send({
                error: "Doc Not Found"
            })
        }
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
})

//Delete My Account
router.delete('/users/deleteAccount', auth, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.user._id)
        sendCancellationEmail(req.user.email, req.user.name)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Setup file validation
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|gif)/)) {
            cb(new Error("File extension must be either jpg or jpeg or gif"))
        }
        cb(undefined, true)
    }
})

//Upload Profile Img
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //req.user.avatar = req.file.buffer
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send(req.user)
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

//Deleting Avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send({
            error: e.message
        })
    }
})

//Get Avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.send(e)
    }
})
module.exports = router


//getting users
// router.get('/users', auth, async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.status(200).send(users)
//     } catch (e) {
//         res.status(500).send({
//             error: e.message
//         })
//     }
// })

//getting specific user by _id
// router.get('/users/:id', async (req, res) => {
//     try {
//         const _id = req.params.id
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send({
//                 error: "Doc Not Found"
//             })
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })