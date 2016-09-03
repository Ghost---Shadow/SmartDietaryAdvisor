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
        var topology = $scope.topologicalSort(root, [], []);
        console.log(topology);
        $scope.procedure = [];
        for (var i = 0; i < topology.length; i++) {
            var step = $scope.buildStepFromHas(topology[i]);
            $scope.procedure.push(step);
        }
        //console.log($scope.procedure);
    }

    $scope.buildStepFromHas = function (has) {
        var step = '';
        step += has.operation + ' ';
        if (has.quantity != null)
            step += has.quantity + ' ' + has.unit + ' of ';
        var input_ingredient = $scope.ingredients[has.input_ingredient];
        step += input_ingredient == null ? ' ' : input_ingredient.name + ' to ';
        var input_recipe = $scope.recipes[has.input_recipe];
        step += input_recipe == null ? ' ' : input_recipe.name + ' ';
        if (has.procedure != null)
            step += has.procedure + ' ';
        var output = $scope.recipes[has.output];
        step += output == null ? '' : 'to make ' + output.name;
        return step;
    }

    $scope.topologicalSort = function (root, topology, visited) {
        if (root == null) return [];
        //visited[root] = true;
        var edges = $scope.moveDown(root);
        console.log(edges);
        for (var i = 0; i < edges.length; i++) {
            if (visited[edges[i].input_recipe]) continue;
            // TODO: FIX BUG
            topology = ($scope.topologicalSort(edges[i].input_recipe, topology, visited));
            topology.push(edges[i]);
        }
        return topology;
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