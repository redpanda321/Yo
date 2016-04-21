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


                } else if (!info || !info.password || !info.repassword || !info.username  /*|| !info.fullname */ ) {
                    $rootScope.notify('请输入完整的信息', 1500);

                    $scope.registerProcess  = false;
                } else if (info.password != info.repassword) {
                    $rootScope.notify('密码不匹配，请重新输入', 1500);

                    $scope.registerProcess  = false;
                } else {
                    var _loading = $ionicLoading.show({
                        content: '注册中 ...',
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
                                _loading.setContent('登录系统 ...');

                                $auth.login(info.username, info.password, function (err, result) {

                                    if (err) {
                                        _loading.setContent('登录失败 ...');

                                        $timeout(function () {
                                            _loading.hide();
                                        }, 500);

                                        //$scope.loginMessage = 'Đăng nhập thất bại !. </br> Vui lòng thử lại';
                                    } else {
                                        _loading.setContent('登录成功 ..');

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
                                        $rootScope.notify('你的设备已经注册过 !\n');
                                        break;

                                    case 'REGISTER.ERR.USERNAME':
                                            $rootScope.notify('此号码注册过! ');
                                        break;
                                }

                            }
                            $logger.info('updateUserInfo', 'resp', result);
                        }
                    });
                }
            };
        }]);