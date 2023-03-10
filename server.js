require('dotenv').config()
require('./utils/auth/passport')
// require('./utils/auth/google')

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require("passport")
const session = require('express-session')
const bodyParser = require('body-parser')

const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')
const paletteRouter = require('./routers/paletteRouter')
const feedbackRouter = require('./routers/feedbackRouter')

const app = express()

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }))
 
app.use(express.json())
app.use(cors())
app.use(passport.initialize())

// app.use(
//   session({
//     secret: process.env.GOOGLE_CLIENT_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// )

app.get('/', (req, res) => res.send('API works!'))

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/palette', paletteRouter)
app.use('/feedback', feedbackRouter)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN)
    app.listen(PORT, () => {
      console.log(`Success server has started on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

startServer()
