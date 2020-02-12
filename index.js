const express = require('express')

const postRouter = require("./routes/post-router.js")

const server = express();

server.use(express.json());


server.use("/api/posts", postRouter)

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda Posts API</h>
    <p>Welcome to the Lambda posts API</p>
  `)
});

const port = 5000
server.listen(port, () => console.log(`\n** API listening on post ${port} \n`));