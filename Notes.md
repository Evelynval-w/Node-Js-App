# Project Notes

## Day 1 
- Initialized Node.js project
- Set up Git and GitHub connection
- Learned about npm init

## What I Learned
- Git init creates a local repository
- Need Personal Access Token for GitHub authentication
- .gitignore prevents node_modules from being pushed

# Express server
## Install Express
### Concept:
- Express is a minimal web framework for Node.js
- Installing it adds Express to your node_modules folder and records it in package.json under dependencies
- The -save flag is now default in modern npm, so npm install express is sufficient
- use code in terminal

```bash
npm install express
```


## N/B

-  "type": "module",  // since i want to use "import express from "express" " -- i added this for the  ES Modules 
-  



- so my package.json file looks like this 
- 
``` jsx
{
  "name": "api2",
  "version": "1.0.0",
  "type": "module",  
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

- Instead of this
- 
``` jsx
{
  "name": "api2",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^5.1.0"
  }
}
```

## A: ES Modules 
**Import Express:**

```bash
const express = require("express")
// or import express from "express"
```

- Loads the Express library
- Returns a function that creates Express applications

## B: CommonJS (Traditional)
express = require("express")

// CommonJS


## Create Application Instance:

```jsx
const app = express()
```

- Calls the Express function to create your app
- This `app` object has methods for routing, middleware, and configuration

**3. Define the Port:**

```jsx
const PORT = 3000
```

- Specifies which port your server listens on
- Common development ports: 3000, 8000, 8080
- In production (like Render), you'll use `process.env.PORT`

**4. Add Middleware:**

```jsx
app.use(express.json())
```

- **What is middleware?** Functions that execute during the request-response cycle
- `express.json()` parses incoming JSON payloads
- Without this, `req.body` would be undefined for JSON requests

**5. Define Routes:**
```jsx
app.get("/", (req, res) => {
    res.json({
	    firstName: "John",
	    lastName: "Doe"
    })
})
​
```
- app.get() defines a route for GET requests
- First parameter: the path ("/" is the root)
- Second parameter: handler function with req (request) and res (response)
- res.json() sends a JSON response


**6. Start the Server:**
```jsx
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
​
```

- Tells Express to listen for requests on the specified port
- The callback runs once the server successfully starts


## Running the server

We could run the server with the command

```bash
node server.js
```

but this i not very developer friendly, because for every change we would need to stop the server, restart it .. naaah, that’s too much !

so we can add a script in the `package.json` file

**Concept:**

- Scripts in `package.json` let you define custom commands
- Makes it easier for others (and yourself) to run the project

Edit your `package.json` and add:

```json
"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
}
```

The `dev` script requires nodemon (install with `npm install --save-dev nodemon`) which auto-restarts on file changes.

So, install the package `nodemon` as a development dependency. This means, it won’t be installed when we deploy the application on Render or some other cloud service.


## Run Your Server

```bash
npm run dev
```

You should see: `Server is running on http://localhost:3000`

### Test Your Server

Open your browser and visit `http://localhost:3000` or use a tool like:

- **Browser**: Just type the URL
- **Postman**: For testing POST/PUT/DELETE requests
- **curl**: Command line tool
- **Thunder Client**: VS Code extension


**To exit the running section of the terminal**

- Use Ctrl + C