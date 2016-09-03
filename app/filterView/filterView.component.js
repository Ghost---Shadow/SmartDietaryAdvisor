'use strict';

app.controller('FilterController', function ($scope, $http,messagePassing) {
    $scope.sharedData = messagePassing.sharedData;
    
    $http.get('/filterView/filterView.static.json').then(function (response) {
        $scope.filters = response.data;
    });

    $scope.onGoButtonPress = function () {
        messagePassing.sharedData.push("Go pressed");
        console.log("Go pressed");
    }
});

