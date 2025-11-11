import express from "express"
// ES Modules 

// or  -- same as import express from "express"
// const express = require("express")


// creatimg application inatnace
const app = express()


const PORT = 3000

app.use(express.json())


app.get("/", (req, res) => {
    res.json({
	    firstName: "John",
	    lastName: "Doe"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})