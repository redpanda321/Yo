'use strict';

angular.module('taxigoDriverApp')
    .controller('RegisterCtrl', ['$rootScope', '$scope', 'logger', 'gmaps', 'fetchData', 'auth', '$state', '$timeout',
        function ($rootScope, $scope, logger, gmaps,  fetchData, auth, $state, $timeout) {
            logger.info('Register Controller', 'start', true);

            $scope.registerProcess  = false;

            // update driver information

            $scope.updateUserInfo = function (info) {
                $scope.registerProcess = true;
                if (!auth.getRegisted) {
                    //TODO : action
                    $scope.registerProcess  = false;

                } else if (!info || !info.password || !info.repassword || !info.username   /* || !info.fullname */ ) {
                    window.toastr.success('请输入完整的信息');

                    $scope.registerProcess  = false;
                } else if (info.password != info.repassword) {
                    window.toastr.success('密码不匹配，请重新输入');

                    $scope.registerProcess  = false;
                } else {
                    
                   

                    // auto register user device if device not register
                    auth.register(info, function (err, result) {
                        if (err) {
                            logger.info('updateUserInfo', 'err', err);
                        } else {
                            if (result.success) {
                                logger.info('Register info', 'success', info);

                                auth.setRegisted();
                                auth.setAppRegister(result.data);

//                                $scope.waitLogin = true;
                                

                                auth.login(info.username, info.password, function (err, result) {

                                    if (err) {
                                      

                                        $timeout(function () {
                                            _loading.hide();
                                        }, 500);

                                        //$scope.loginMessage = 'Đăng nhập thất bại !. </br> Vui lòng thử lại';
                                    } else {
                                      

                                        $timeout(function () {
                                            _loading.hide();
                                        }, 500);

                                        $rootScope.isLogin = true;
                                        $scope.waitLogin = false;
                                        $scope.loginMessage = '';
                                        $scope.registerProcess  = false;

                                        $state.go('taxiGoDriver.home');
                                    }
                                });
                            } else {
                                $scope.registerProcess  = false;
                                switch (result.message) {
                                    case 'REGISTER.ERR.REGISTED':
                                        winodw.toastr.success('你的设备已经注册过 !');
                                        break;

                                    case 'REGISTER.ERR.USERNAME':
                                        window.toastr.success('此号码注册过!');
                                        break;
                                }

                            }
                            logger.info('updateUserInfo', 'resp', result);
                        }
                    });
                }
            };
        }]);