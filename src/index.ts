import express from 'express'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => res.send('Dockerizing Node Application'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(`⚡️ [bootup]: Server is running at port: ${PORT}`)
)
