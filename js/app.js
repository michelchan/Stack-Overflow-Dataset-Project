var app = angular.module('app', ['ngRoute']);


app.controller('SelectController', ["$scope", "$http", function($scope, $http){
	$http.get('data/data.json').success(function(data) {
		$scope.columns = Object.keys(data[0]);
		$scope.value = $scope.columns[0];
	});
	console.log($scope.columns)
}]);