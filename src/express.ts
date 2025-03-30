import express from 'express'
import cors from "cors"
const app = express()
const port = 4480

const router = express.Router()

router.get('/test', (req, res) => {
  res.json({test: "test"})
})

app.use(cors({ origin: '*'}))

app.use( '/', router)

app.post('/qrcode_callback', (req, res) => {
  console.log(req.body)

  res.sendStatus(200)
})

// app.listen(port, () => {
//   console.log(`listening on port ${port}`)
// })