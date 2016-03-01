'use strict';

angular.module('itaxiApp')
    .controller('RegisterCtrl', ['$rootScope', '$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', '$state', '$timeout', '$ionicLoading',
        function ($rootScope, $scope, $logger, gmaps, taxi, $fetchData, $auth, $state, $timeout, $ionicLoading) {
            $logger.info('Register Controller', 'start', true);

            $scope.registerProcess  = false;

            // update user information

            $scope.updateUserInfo = function (info) {
                $scope.registerProcess = true;
                if (!$auth.getRegisted) {
                    //TODO : action
                    $scope.registerProcess  = false;

                } else if (!info || !info.password || !info.repassword || !info.username || !info.fullname) {
                    $rootScope.notify('Please enter complete information', 1500);

                    $scope.registerProcess  = false;
                } else if (info.password != info.repassword) {
                    $rootScope.notify('2 Passwords do not match! please enter the exact', 1500);

                    $scope.registerProcess  = false;
                } else {
                    var _loading = $ionicLoading.show({
                        content: 'Subscribing ...',
                        showBackdrop: false
                    });
                    var uId = $auth.getAppRegisterInfo().id;

                    // auto register user device if device not register
                    $auth.updateUserInfo(info, function (err, result) {
                        if (err) {
                            $logger.info('updateUserInfo', 'err', err);
                        } else {
                            if (result.success) {
                                $logger.info('Register info', 'success', info);

                                $auth.setRegisted();
                                $auth.setAppRegister(result.data);

//                                $scope.waitLogin = true;
                                _loading.setContent('Are logged into the system ...');

                                $auth.login(info.username, info.password, function (err, result) {

                                    if (err) {
                                        _loading.setContent('Login failed ...');

                                        $timeout(function () {
                                            _loading.hide();
                                        }, 500);

                                        //$scope.loginMessage = 'Đăng nhập thất bại !. </br> Vui lòng thử lại';
                                    } else {
                                        _loading.setContent('logged in successfully ..');

                                        $timeout(function () {
                                            _loading.hide();
                                        }, 500);

                                        $rootScope.isLogin = true;
                                        $scope.waitLogin = false;
                                        $scope.loginMessage = '';
                                        $scope.registerProcess  = false;

                                        $state.go('app.home');
                                    }
                                });
                            } else {
                                $scope.registerProcess  = false;
                                switch (result.message) {
                                    case 'REGISTER.ERR.REGISTED':
                                        $rootScope.notify('Your device is already registered !\n');
                                        break;

                                    case 'REGISTER.ERR.USERNAME':
                                            $rootScope.notify('This phone number has been used! ');
                                        break;
                                }

                            }
                            $logger.info('updateUserInfo', 'resp', result);
                        }
                    });
                }
            };
        }]);