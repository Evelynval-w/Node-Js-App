
import { logMiddleware } from "./middleware.js"

import express from "express"
// ES Modules 

// or  -- same as import express from "express"
// const express = require("express")


// creatimg application inatnace
const app = express()


const PORT = 3000

const users = [
	{ id: 1, name: "Alice" },
	{ id: 2, name: "Bob" },
	{ id: 3, name: "Charlie" },
	{ id: 4, name: "Dave" },
]


app.use(express.json())



// middleware to log request body

// app.get("/", (req, res) => {
    // res.json({
	    // firstName: "John",
	    // lastName: "Doe"
    // })
// })

// commented this out to add the logging middleware using a shorter version ... from the import

// app.use(async (req, res, next) => {
	// const date = new Date().toISOString()
	// console.log(`[${date}] ${req.method} ${req.url}`)
// 
    // const response = await fetch("https://jsonplaceholder.typicode.com/users/1")
	// const data = await response.json()
	// req.data = data
	// console.log(data)
// 
	// next()
// })



// for printing output

// app.get("/", (req, res) => {
    // const data = req.data
	// res.json({users, data})
// })

// html response better for browser view
// added loglogMiddleware here

// it helps log the time when ever you visite your localhost
app.get("/",logMiddleware, (req, res) => {
    const data = req.data;
    res.send(`
        <html>
            <head>
                <title>API Data</title>
                <style>
                    body { font-family: monospace; padding: 20px; }
                    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Users Data</h1>
                <pre>${JSON.stringify({ users, data }, null, 2)}</pre>
            </body>
        </html>
    `);
});



app.post("/", (req, res) => {
	console.log(req)
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})