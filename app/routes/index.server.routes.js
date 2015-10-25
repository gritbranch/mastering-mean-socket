//Creates a function using CommonJS module pattern. Example of single module function.
module.exports = function(app) {
	//Required your index controller so we can use its render().
    var index = require('../controllers/index.server.controller');
    app.get('/', index.render);
};