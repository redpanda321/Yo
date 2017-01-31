'use strict';

angular.module('itaxiApp')
    .factory('config', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        var config = {
            deviceId: (window.device) ? device.uuid : 'vsoft.deverlopment12333',
            defaultPass: 'defaultPassword',
            name: '????',
            //apiHost: 'http://taxigo.vn:9989',
            apiHost: 'http://www.weiyou7.com:6868',
            mediaHost: 'http://www.weiyou7.com:6868',
            isLogin: false
        };

        return config;

    }]);