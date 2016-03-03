'use strict';

angular.module('itaxiApp')
    .controller('LoginCtrl', ['$rootScope', '$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', '$ionicLoading', '$timeout', '$state',
        function ($rootScope, $scope, $logger, gmaps, taxi, $fetchData, $auth, $ionicLoading, $timeout, $state) {

            $logger.info('Login Controller', 'start', true);


            // get Data login from template
            $scope.login = function (loginData) {

                var username, password;


                if (!loginData || !loginData.username || !loginData.password) {
                    $rootScope.notify('请输入完整的信息');
                } else {
                    username = loginData.username;
                    password = loginData.password;


                    $rootScope.notify('保存日志...', 2000);
                    // function login from vsoft.js

                    $auth.login(username, password, function (err, result) {

                        if (err) {
                            $rootScope.notify('用户名或密码不正确 ', 2000);
                            loginData.username = '';
                            loginData.password = '';
                        }
                        else {
                            $rootScope.isLogin = true;
                            $rootScope.notify('日志记录成功 ', 2000);
                            $state.go('app.home');
                        }
                    });
                }

            };

        }]);