///@time 1759
//https://github.com/fridays/next-routes
const routes = require('next-routes')();//notice the second set
//those parenthesis invoke the function immediately

//set up custom routes' :______
//the routing library thinks that our projects/new is a detail address
routes //the order we add, the order we parse
    .add('/projects/new', '/projects/new')//fixed the override rule by .add before
    .add('/projects/:address', '/projects/details')//what pattern do we want to look for?
//the wildcard : project address, which route do we want to show
    .add('/projects/:address/requests', '/projects/requests/index')
    //beware of collisions...
    .add('/projects/:address/requests/new', '/projects/requests/new')
//export statement gives us the helpers
module.exports = routes;