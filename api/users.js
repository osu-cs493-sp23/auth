/*
* API routes for 'users' collection.
*/

const router = require('express').Router()

const { validateAgainstSchema } = require('../lib/validation')
const { UserSchema, insertNewUser, getUserById } = require('../models/user')

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

router.get('/:id', async function (req, res, next) {
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
})

module.exports = router
