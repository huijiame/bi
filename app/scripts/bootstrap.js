define([
    'angular',
    'app'
], function (angular) {
    'use strict';
    // console.log('bootstrap.js');
    angular.element(document).ready(function () {
        // console.log('bootstrap start ');
        angular.bootstrap(document, ['ahaApp']);
        //console.log('bootstrap  end ');
    });
});