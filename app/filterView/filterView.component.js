'use strict';

app.controller('FilterController', function ($scope, $http) {
    $http.get('/filterView/filterView.static.json').then(function (response) {
        $scope.filters = response.data;
    });

    $scope.onGoButtonPress = function () {
        console.log("Go pressed");
    }
});

