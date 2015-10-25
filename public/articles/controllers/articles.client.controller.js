//Uses four injected services:
//$routeParams: This is provided with the ngRoute module and holds references to route parameters of the AngularJS routes you'll define next
//$location: This allows you to control the navigation of your application
//Authentication: You created this service in the previous lesson and it provides you with the authenticated user information
//Articles: You created this service articles.client.service.js

angular.module('articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'Authentication', 'Articles', function($scope, $routeParams, $location, Authentication, Articles) {
    //binds the Authentication service to the $scope object so that views will be able to use it as well
    $scope.authentication = Authentication;
    
    
    //create() method functionality. 
    //First, you used the title and content form fields, and then the Articles resource service to create a new article resource. 
    //Then, you used the article resource $save() method to send the new article object to the corresponding RESTful endpoint, along with two callbacks. 
    $scope.create = function() {
      var article = new Articles({
        title: this.title,
        content: this.content
      });
    
      article.$save(function(response) {
        $location.path('articles/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    
    //find() method will retrieve a list of articles and uses the resource query() method because it expects a collection 
    $scope.find = function() {
      $scope.articles = Articles.query();
    };
    
    //findOne() method will retrieve a single article based on the articleId route parameter
    $scope.findOne = function() {
      $scope.article = Articles.get({
        articleId: $routeParams.articleId
      });
    };
    
    
    //update() method, you used the resource article's $update() method to send the updated article object to the corresponding RESTful endpoint, along with two callbacks.
    $scope.update = function() {
      $scope.article.$update(function() {
        $location.path('articles/' + $scope.article._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    
    //delete() method will first figure out whether the user is deleting an article from a list or directly from the article view. It will then use the article's $remove() method to call the corresponding RESTful endpoint. 
    //If the user deleted the article from a list view, it will then remove the deleted object from the articles collection; otherwise, it will delete the article then redirect the user back to the list view.
    $scope.delete = function(article) {
      if (article) {
        article.$remove(function() {
          for (var i in $scope.articles) {
            if ($scope.articles[i] === article) {
              $scope.articles.splice(i, 1);
            }
          }
        });
      } else {
        $scope.article.$remove(function() {
          $location.path('articles');
        });
      }
    };

  }
]);