'use strict';

app.controller('ProcedureController', function ($scope,$http) {
    $http.get('/procedureView/procedureView.static.json').then(function (response) {
        $scope.procedure = response.data;
    });
});