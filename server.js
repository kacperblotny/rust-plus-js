const express = require('express')
// const connectDB = require('./config/db')

const app = express()

// connectDB()

// Init middleware
// app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send('api running'))

const PORT = process.env.PORT || 5002

app.listen(PORT, () => console.log(`server started on port ${PORT}`))
