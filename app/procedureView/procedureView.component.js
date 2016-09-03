'use strict';

app.controller('ProcedureController', function ($scope, $http, messagePassing) {
    $scope.sharedData = messagePassing.sharedData;

    $http.get('/procedureView/procedureView.static.json').then(function (response) {
        $scope.ingredients = response.data.ingredients;
        $scope.recipes = response.data.recipes;
        $scope.has = response.data.has;
        $scope.buildProcedure(4); // TODO: TEMPORARY
    });

    $scope.buildProcedure = function (root) {
        var topology = [];
        $scope.topologicalSort(root, topology, []);
        $scope.procedure = [];
        for (var i = 0; i < topology.length; i++) {
            var step = $scope.buildStepFromHas(topology[i]);
            $scope.procedure.push(step);
        }
    }

    $scope.buildStepFromHas = function (has) {
        var step = '';
        step += has.operation + ' ';
        step += has.quantity == null ? '' : has.quantity + ' ';
        step += has.unit == null ? '' : has.unit + ' of ';
        var input_ingredient = $scope.ingredients[has.input_ingredient];
        step += input_ingredient == null ? ' ' : input_ingredient.name + ' ';
        var input_recipe = $scope.recipes[has.input_recipe];
        step += input_recipe == null || input_recipe.anonymous ? '' : ' to ' + input_recipe.name + ' ';
        step += has.procedure == null ? '' : has.procedure + ' ';
        var output = $scope.recipes[has.output];
        step += output == null || output.anonymous ? '' : 'to make ' + output.name;
        return step;
    }

    $scope.topologicalSort = function (root, topology, visited) {
        if (root == null) return [];
        visited[root] = true;
        var edges = $scope.moveDown(root);
        for (var i = 0; i < edges.length; i++) {
            if (visited[edges[i].input_recipe]) continue;
            $scope.topologicalSort(edges[i].input_recipe, topology, visited);
        }
        for (var i = 0; i < edges.length; i++) {
            topology.push(edges[i]);
        }
    }

    $scope.moveDown = function (node) {
        var edges = [];
        for (var i = 0; i < $scope.has.length; i++) {
            if ($scope.has[i].output == node) {
                edges.push($scope.has[i]);
            }
        }
        return edges;
    }
});