'use strict';

angular.module('itaxiApp')
    .factory('config', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        var config = {
            deviceId: (window.device) ? device.uuid : 'vsoft.deverlopment12333',
            defaultPass: 'defaultPassword',
            name: 'YoYo',
            //apiHost: 'http://taxigo.vn:9989',
            apiHost: 'http://54.187.5.33:6868',
            mediaHost: 'http://54.187.5.33:6868',
            isLogin: false
        };

        return config;

    }]);