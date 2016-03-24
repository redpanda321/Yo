'use strict';

angular.module('itaxiApp')
    .factory('config', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        var config = {
            deviceId: (window.device) ? device.uuid : 'vsoft.deverlopment12333',
            defaultPass: 'defaultPassword',
            name: '????',
            //apiHost: 'http://taxigo.vn:9989',
            apiHost: 'http://52.36.82.220:6868',
            mediaHost: 'http://52.36.82.220:6868',
            isLogin: false
        };

        return config;

    }]);