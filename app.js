import express from "express"
const app = express()
import cookieParser from "cookie-parser"
import errorMiddleWare from "./middleware/error.js"
import bodyParser from "body-parser"

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/about', (req, resp) => {
  resp.send("welcome to home page")
})

// route imports
import  product from "./routes/productRoute.js"
import user from "./routes/userRoute.js"

app.use("/api/v1", product)
app.use("/api/v1", user)

app.use(errorMiddleWare)

export default app