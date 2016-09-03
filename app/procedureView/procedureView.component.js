'use strict';

app.controller('ProcedureController', function ($scope, $http, messagePassing) {

    $http.get('/procedureView/procedureView.static.json').then(function (response) {
        $scope.ingredients = response.data.ingredients;
        $scope.operations = response.data.operations;
    });

    $scope.generate = function () {
        $scope.allowedClasses = [];
        for (var i = 0; i < messagePassing.allowedClasses.length; i++) {
            if (messagePassing.allowedClasses[i].value) {
                $scope.allowedClasses.push(messagePassing.allowedClasses[i].name);
            }
        }
        //console.log($scope.allowedClasses);
        $scope.targetCalories = messagePassing.targetCalories.value;
        //console.log($scope.targetCalories);
        $scope.buildProcedure();        
    }

    $scope.buildProcedure = function () {
        // Select random number of ingredients of filtered classes
        var kitchenTable = $scope.populateKitchenTable();
        //console.log(kitchenTable);
        $scope.recipeName = $scope.generateRecipeName(kitchenTable);

        // Select random operations and make sure the order is valid
        var actions = $scope.generateActions(kitchenTable);
        //console.log(actions);

        // Build steps for each operations and push in procedure
        $scope.procedure = [];
        for (var i = 0; i < actions.length; i++) {
            //console.log(actions[i]);
            $scope.procedure.push($scope.buildStep(actions[i]));
        }
    }

    // TODO: Make markovian
    $scope.generateRecipeName = function (kitchenTable) {
        var prefix = ['Royal', 'Indian', 'Chinese', 'Tandoor'];
        var suffix1 = ['ey', 'ed', ''];
        var suffix2 = ['delight', 'delux', ''];

        var shortList1 = [];
        for (var i = 0; i < kitchenTable.length; i++)
            if (kitchenTable[i].class == 'fat' || kitchenTable[i].class == 'egg')
                shortList1.push(kitchenTable[i]);

        var shortList2 = [];
        for (var i = 0; i < kitchenTable.length; i++)
            if (kitchenTable[i].class == 'vegetable' || kitchenTable[i].class == 'meat')
                shortList2.push(kitchenTable[i]);

        var index1 = Math.floor(Math.random() * shortList1.length);
        var index2 = Math.floor(Math.random() * shortList2.length);

        var item1 = shortList1[index1] == null ? 'double' : shortList1[index1].name;
        var item2 = shortList2[index1] == null ? 'combo' : shortList2[index1].name;

        return prefix[Math.floor(Math.random() * prefix.length)] + ' ' + item1 +
            suffix1[Math.floor(Math.random() * suffix1.length)] + ' ' + item2 + ' '
            + suffix2[Math.floor(Math.random() * suffix2.length)];
    }

    $scope.populateKitchenTable = function () {
        var kitchenTable = [];
        var chanceOfSelection = 0.5;

        // TODO: Make markovian
        for (var i = 0; i < $scope.ingredients.length; i++) {
            var ingredient = $scope.ingredients[i];
            //console.log($scope.allowedClasses);
            if ($scope.allowedClasses.indexOf(ingredient.class) == -1) {
                //console.log(ingredient);
                continue;
            }
            if (Math.random() < chanceOfSelection) {
                kitchenTable.push(ingredient);
                chanceOfSelection -= .1;
            }
        }
        return kitchenTable;
    }

    $scope.generateActions = function (kitchenTable) {
        var actions = [];
        // Preprocess stage
        for (var i = 0; i < kitchenTable.length; i++) {
            actions.push($scope.findValidAction(kitchenTable[i], actions, false));
        }

        //var assemblyActions = $scope.getAssemblyActions();

        // Assembly stage
        while (kitchenTable.length != 1) {
            var index1 = Math.floor(Math.random() * kitchenTable.length);
            var item1 = kitchenTable.splice(index1, 1);
            var index2 = Math.floor(Math.random() * kitchenTable.length);
            var item2 = kitchenTable.splice(index2, 1);
            var component = [item1, item2];
            kitchenTable.push(component);
            actions.push($scope.findValidAction(component, actions, true));
        }
        return actions;
    }

    $scope.findValidAction = function (component, prevActions, isAssembly) {
        var validOperations = [];
        var label = isAssembly ? "assembly" : component.class;

        for (var i = 0; i < $scope.operations.length; i++) {
            //console.log($scope.operations[i].class + ' '+ label);
            if ($scope.operations[i].class == label) {
                validOperations.push($scope.operations[i]);
            }
        }

        // TODO: Make markovian
        var index = Math.floor(Math.random() * validOperations.length);
        var selectedOperation = validOperations[index];
        var action = { "component": component, "operation": selectedOperation };
        return action;
    }

    $scope.buildStep = function (action) {
        var step = '';
        step += action.operation.begin != null ? action.operation.begin + ' ' : ' ';
        if (Array.isArray(action.component)) {
            var components = [];
            $scope.linearize(action.component, components);
            for (var i = 0; i < components.length - 1; i++) {
                step += components[i] + ', ';
            }
            step += 'and ' + components[components.length - 1] + ' ';
        } else {
            step += Math.floor(Math.random() * 100); // FIX
            step += ' gram of ';
            step += action.component.name != null ? action.component.name + ' ' : ' ';
        }

        step += action.operation.end != null ? action.operation.end + ' ' : ' ';
        //console.log(step);
        return step;
    }

    $scope.linearize = function (components, list) {
        for (var i = 0; i < components.length; i++) {
            if (Array.isArray(components[i])) {
                list.concat($scope.linearize(components[i], list));
            } else {
                list.push(components[i].name);
            }
        }
        //console.log(list);
        return list;
    }
});