const { createServer } = require('http');

const next = require('next')

const app = next({ //app must be running in production mode
    dev: process.env.NODE_ENV !== 'production'
}); //this is the env issue that i've been worrying about!

const routes = require('./routes')

//navigation stuff, pass in app object
const handler = routes.getRequestHandler(app);

//listen to a specific port
app.prepare().then(() => {
    createServer(handler).listen(3000, (err) => {
        if(err)throw err;
        console.log('ready on localhost:3000');
    })
})
//customize our startup script (npm "next dev")=>package.json
//"dev": "node server.js"