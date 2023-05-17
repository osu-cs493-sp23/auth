/*
* API routes for 'users' collection.
*/

const router = require('express').Router()

const { validateAgainstSchema } = require('../lib/validation')
const {
    UserSchema,
    insertNewUser,
    getUserById,
    validateUser
} = require('../models/user')
const { generateAuthToken, requireAuthentication } = require("../lib/auth")

router.post('/', async function (req, res) {
    if (validateAgainstSchema(req.body, UserSchema)) {
        try {
            const id = await insertNewUser(req.body)
            res.status(201).send({ _id: id })
        } catch (e) {
            next(e)
        }
    } else {
        res.status(400).send({
            error: "Request body does not contain a valid User."
        })
    }
})

router.post('/login', async function (req, res, next) {
    if (req.body && req.body.id && req.body.password) {
        try {
            const authenticated = await validateUser(
                req.body.id,
                req.body.password
            )
            if (authenticated) {
                const token = generateAuthToken(req.body.id)
                res.status(200).send({
                    token: token
                })
            } else {
                res.status(401).send({
                    error: "Invalid authentication credentials"
                })
            }
        } catch (e) {
            next(e)
        }
    } else {
        res.status(400).send({
            error: "Request body requires `id` and `password`."
        })
    }
})

router.get('/:id', requireAuthentication, async function (req, res, next) {
    if (req.user === req.params.id) {
        try {
            const user = await getUserById(req.params.id)
            if (user) {
                res.status(200).send(user)
            } else {
                next()
            }
        } catch (e) {
            next(e)
        }
    } else {
        res.status(403).send({
            err: "Unauthorized to access the specified resource"
        })
        // next()
    }
})

module.exports = router
