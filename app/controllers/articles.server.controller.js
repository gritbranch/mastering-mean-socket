var mongoose = require('mongoose'),
    Article = mongoose.model('Article'); // Includes your Article mongoose model
	
// Gets the Mongoose error object passed as an argument then iterates over the errors collection and extract the first message
var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return 'Unknown server error';
  }
};	

// First, you created a new Article model instance using the HTTP request body. 
// Next, you added the authenticated Passport user as the article creator(). 
// Finally, you used the Mongoose instance save() method to save the article document.
exports.create = function(req, res) {
  var article = new Article(req.body);
  article.creator = req.user;

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.list = function(req, res) {
	// find() function of Mongoose to get the collection of article documents, and while we could add a MongoDB query of some sort, for now we'll retrieve all the documents in the collection.
	// populate() method of Mongoose was used to add some user fields to the creator property of the articles objects. In this case, you populated the firstName, lastName, and fullName properties of the creator user object.
  Article.find().sort('-created').populate('creator', 'firstName   lastName fullName').exec(function(err, articles) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

// Middleware function signature contains all the Express middleware arguments and an id argument
exports.articleByID = function(req, res, next, id) {
  Article.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('Failed to load article ' + id));

    req.article = article;
    next();
  });
};

// Output the article object as a JSON representation. Assumes that you already obtained the article object in the articleByID() middleware.
exports.read = function(req, res) {
  res.json(req.article);
};


// update() method also makes the assumption that you already obtained the article object in the articleByID() middleware.
exports.update = function(req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

// delete() method also makes use of the already obtained article object by the articleByID() middleware.
exports.delete = function(req, res) {
  var article = req.article;

  article.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

//The hasAuthorization() middleware is using the req.article and req.user objects to verify that the current user is the creator of the current article.
exports.hasAuthorization = function(req, res, next) {
    if (req.article.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};