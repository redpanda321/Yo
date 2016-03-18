'use strict';

angular.module('taxigoDriverApp')
    .controller('toolBarCtrl', ['$scope', '$rootScope' , 'gmaps', '$timeout', 'auth', '$state', 'logger', function ($scope, $rootScope, gmaps, $timeout, auth, $state, logger) {

        // Exit application

        $scope.logout = function () {
            var confirm = window.confirm("要退出?");
            if (confirm == true) {
                auth.logout(function (success) {
                    if (success) {
                        $rootScope.isLogin = false;

                        if(window.socketIo){
                            window.socketIo.disconnect();
                        }

                        $state.go('login');

                    } else {
                    }
                });
            }

        };

        /*Point your current location on the map*/


        $scope.goToCenter = function () {
            console.log('OK to center : ');
            gmaps.direcCenter();
        }
    }]);