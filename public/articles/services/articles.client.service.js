//ngResource object has several methods to handle the default RESTful resource routes, and it can optionally be extended by custom methods. The default resource methods are as follows:
//get(): This method uses a GET HTTP method and expects a JSON object response
//save(): This method uses a POST HTTP method and expects a JSON object response
//query(): This method uses a GET HTTP method and expects a JSON array response
//remove(): This method uses a DELETE HTTP method and expects a JSON object response
//delete(): This method uses a DELETE HTTP method and expects a JSON object response

//This service uses the $resource factory with three arguments: 
//the base URL for the resource endpoints, 
//a routing parameter assignment using the article's document _id field, 
//and an actions argument extending the resource methods with an update() method that uses the PUT HTTP method.
angular.module('articles').factory('Articles', ['$resource', function($resource) {
  return $resource('api/articles/:articleId', {
    articleId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);