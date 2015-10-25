//Creates a function render using CommonJS module pattern. This is an example of exporting several functions.
exports.render = function(req, res) {
	if (req.session.lastVisit) {
    	console.log(req.session.lastVisit);
	}

	//record the time of the last user request
 	req.session.lastVisit = new Date();

	//first argument is the name of your EJS template without the .ejs extension, and the second argument is an object containing your template variables
	res.render('index', {
		title: 'Das Auto',
		//This contains the authenticated user's full name to your home page template
		userFullName: req.user ? req.user.fullName : '',
		//Render the authenticated user object
		user: JSON.stringify(req.user)
  	})
};