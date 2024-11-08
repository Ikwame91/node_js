

const http = require('http')

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.end('Welcome to to our home page')
    }
    if (req.url === '/about') {
        res.end('Here is our short story')
    }
    res.end(
        `<h1>OOps</h1>
    <p> We can't seem to find the page you are looking for  </p>
    < href ="/">back home </a>
    `
    )

})

server.listen(5000)
