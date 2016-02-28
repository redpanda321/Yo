'use strict';

angular.module('itaxiApp')
    .factory('config', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        var config = {
            deviceId: (window.device) ? device.uuid : 'vsoft.deverlopment12333',
            defaultPass: 'defaultPassword',
            name: 'Taxi Go',
            //apiHost: 'http://taxigo.vn:9989',
            apiHost: 'http://ec2-54-187-5-33.us-west-2.compute.amazonaws.com:6868',
            mediaHost: 'http://nodejs.vn:9697',
            isLogin: false
        };

        return config;

    }]);