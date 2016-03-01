'use strict';

angular.module('itaxiApp')
    .controller('LoginCtrl', ['$rootScope', '$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', '$ionicLoading', '$timeout', '$state',
        function ($rootScope, $scope, $logger, gmaps, taxi, $fetchData, $auth, $ionicLoading, $timeout, $state) {

            $logger.info('Login Controller', 'start', true);


            // get Data login from template
            $scope.login = function (loginData) {

                var username, password;


                if (!loginData || !loginData.username || !loginData.password) {
                    $rootScope.notify('Please enter complete information');
                } else {
                    username = loginData.username;
                    password = loginData.password;


                    $rootScope.notify('Are logged into the system...', 2000);
                    // function login from vsoft.js

                    $auth.login(username, password, function (err, result) {

                        if (err) {
                            $rootScope.notify('Username or password is incorrect ', 2000);
                            loginData.username = '';
                            loginData.password = '';
                        }
                        else {
                            $rootScope.isLogin = true;
                            $rootScope.notify('logged in successfully ', 2000);
                            $state.go('app.home');
                        }
                    });
                }

            };

        }]);