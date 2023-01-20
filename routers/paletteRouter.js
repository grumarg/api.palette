const Router = require('express')
const { check } = require('express-validator')

const controller = require('../controllers/paletteController')

const authMiddleware = require('../middlewares/auth')

const router = new Router()

router.get('/get', controller.getPalettes)

router.get('/get/:id', controller.getPaletteById)

router.post('/create', [
  check('colors', 'Amount of colors should be equal to 5').custom(values => values.length === 5),
  check('colors', 'All colors should 6 hex string. Example: #ffffff').custom(values => values.every(item => item.match(/\#....../i)))
], controller.paletteCreate)

router.post('/finder', controller.paletteFinder)

router.post('/add/like', controller.paletteAddLike)

router.delete('/delete/:id', authMiddleware, controller.deletePalette)

module.exports = router