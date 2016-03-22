/**
 * Created by Taipham on 3/12/14.
 */
'use strict';


angular.module('taxigoDriverApp')
    .controller('MainCtrl', ['$rootScope', '$scope', 'gmaps', '$timeout', 'auth', '$state', 'config', 'driver', '$location', 'fetchData', 'socketIoService', '$interval', 'logger', 'restful',
        function ($rootScope, $scope, gmaps, $timeout, auth, $state, config, driver, $location, fetchData, socketIoService, $interval, logger, restful) {

            /*Check domain has not always load main.js token, the login and load through gmap*/

            var maxTimeWait = 9000;
            var loadHistory;
            var showAlert;
            var start;
            var end;
            var messCustomer;

            $scope.listHistory = [];
            $scope.directionInfo = {};

            showAlert = function (mess, title) {
                if (navigator.notification) {
                    navigator.notification.alert(
                        mess,  // message
                        alertDismissed,
                        title,
                        'OK'
                    );
                } else {
                    alert(mess);
                }
            };

            function alertDismissed() {
                // TODO: something
            }

            loadHistory = function () {
                var userId = auth.getUserId();
                var filter = [
                    {
                        property: 'driver',
                        value: userId,
                        type: 'string',
                        comparison: 'eq'
                    }
                ];
                var sorter = [
                    {
                        property: 'endAt',
                        direction: 'DESC'
                    }
                ];
                fetchData.getData('RouteHistories', 0, 1000, filter, sorter).then(function (result) {
                    //console.log(result.all());
                    $scope.listHistory = result.all();
                })
            };

            var loadCustomerInfo = function () {
                var uId = driver.getDirectionInfo()[0].customer.id;// '53573418dd6dd1887dfc5c41' ;
                restful.get({table: 'Users', id: uId}, function (resp) {

                })
            };

            $scope.listMessage = []; //cm: List messages

            $scope.goToCenter = function () {
                gmaps.direcCenter();
            };


            function load() {
                if (driver.getCurrentStatus() == 1 && driver.getRouteStatus() == 0) {
                    console.log('F5...');
                    $rootScope.acceptCustomer = true;
                    $rootScope.acceptCustomerStart = true;
                }

                if (driver.getRouteStatus() == 1) {
                    console.log('F5...');
                    $rootScope.acceptCustomer = true;
                    $rootScope.acceptCustomerStart = false;
                }
            }


            $scope.sendMessage = function (messageContent) {

                var emitData = {
                    from: auth.getUserName(),
                    to: driver.getDirectionInfo()[0].customer.deviceId.toLowerCase(),
                    name: 'Taxi',
                    deviceId: config.deviceId,
                    content: messageContent,
                    time: new Date(),
                    status: 0
                };
                socketIoService.emit('send:message', emitData);
                console.log('send:message', emitData);

                $scope.listMessage.push(emitData);


            };


            socketIoService.on('receipt:message', function (data) {
                if (navigator.notification) {
                    navigator.notification.beep(1);
                    navigator.notification.alert(
                        '内容 : ' + data.content ,  // message
                        function (){},         // callback
                        '客户留言 ',            // title
                        '同意'                  // buttonName
                    );
                }else {
                    alert('客户留言: ' + data.content);
                }

                logger.info('socketIoService', 'receipt:message', data);
                /*$scope.listMessage.push(data);*/

            });


            if (driver.getDirectionInfo()) {
                $scope.directionInfo = driver.getDirectionInfo()[0];
                loadCustomerInfo();
            }

            $scope.checkCustomerEmtry = function () {
                $rootScope.readMess = false;
                if (driver.getDirectionInfo() == false) {
                    /* showAlert('Bạn chưa có khách hàng nào!', 'TaxiGo');*/
                    toastr.success('没有任何客户!');

                } else if ($rootScope.customerInfo.status == 2) {
                    showAlert('客户路线!', '约约');
                } else {
                    $rootScope.switchListTaxi(3);
                    //TODO : you can action is here
                    console.log('You can action here!!!');
                }
            };

            $scope.deleteRouter = function (status) {
                if (status) {
                    driver.updateRoute(driver.getDirectionInfo()[0].id, 3, function (err, result) {
                        if (err) {
                            showAlert('信息：无法取消线路', '约约');
                        } else {

                            //console.log('Destroy route ', result);
                            socketIo.emit('destroy:route', {
                                roomID: driver.getCurrentRoomID(),
                                status: 3,
                                customer: result.customer.deviceId,
                                driver: result.driver.username
                            });

                            driver.setCurrentRoomID(null);

                            driver.setCurrentStatus(0);
                            driver.setDirectionInfo(null);

                            angular.forEach(gmaps.listMarkerCustomer, function (v, k) {
                                gmaps.map.removeLayer(v);
                            });

                            if (gmaps.endPointMarker && gmaps.startPointMarker) {
                                gmaps.map.removeLayer(gmaps.endPointMarker);
                                gmaps.map.removeLayer(gmaps.startPointMarker);
                            }
                            if (gmaps.RoutePolyline) {
                                gmaps.map.removeLayer(gmaps.RoutePolyline);
                            }


                            gmaps.map.setZoom(17);

                            gmaps.map.panTo(gmaps.currentPoint.getLatLng());


                            toastr.success('线路成功结束.');

                            $rootScope.acceptCustomer = false;
                            $rootScope.acceptCustomerStart = false;

                            //window.location.reload();

                        }
                    });

                } else {
                    if (driver.getDirectionInfo()[0].status == 0) { // going to position of customer

                        if (window.confirm('您确定要取消这个线路?')) {
                            driver.updateRoute(driver.getDirectionInfo()[0].id, 4, function (err, result) {
                                if (err) {
                                    showAlert('信息：无法取消线路', '约约');
                                } else {

                                    socketIo.emit('destroy:route', {
                                        roomID: driver.getCurrentRoomID(),
                                        status: 4,
                                        customer: result.customer.deviceId,
                                        driver: result.driver.username
                                    });


                                    driver.setCurrentRoomID(null);
                                    driver.setCurrentStatus(0);
                                    driver.setDirectionInfo(null);

                                    angular.forEach(gmaps.listMarkerCustomer, function (v, k) {
                                        gmaps.map.removeLayer(v);
                                    });

                                    if (gmaps.endPointMarker && gmaps.startPointMarker) {
                                        gmaps.map.removeLayer(gmaps.endPointMarker);
                                        gmaps.map.removeLayer(gmaps.startPointMarker);
                                    }
                                    if (gmaps.RoutePolyline) {
                                        gmaps.map.removeLayer(gmaps.RoutePolyline);
                                    }


                                    gmaps.map.setZoom(17);

                                    gmaps.map.panTo(gmaps.currentPoint.getLatLng());

                                    /*  $rootScope.tooltip.open('Thông báo : kết thúc trình thành công', 4000);*/
                                    toastr.success('路线成功结束.');

                                    $rootScope.acceptCustomer = false;
                                    $rootScope.acceptCustomerStart = false;


                                }
                            });
                        }
                    } else {
                        if (window.confirm('要结束线路 ?')) {
                            driver.updateRoute(driver.getDirectionInfo()[0].id, 2, function (err, result) {
                                if (err) {
                                    /* showAlert('Thông báo : có lỗi xảy ra !. Không thể kết thúc lộ trình', 'TaxiGo');*/

                                    toastr.success('发生错误，不能结束这条线路');
                                } else {

                                    socketIo.emit('destroy:route', {
                                        roomID: driver.getCurrentRoomID(),
                                        status: 2
                                    });

                                    driver.setCurrentRoomID(null);
                                    driver.setCurrentStatus(0);
                                    driver.setDirectionInfo(null);

                                    angular.forEach(gmaps.listMarkerCustomer, function (v, k) {
                                        gmaps.map.removeLayer(v);
                                    });

                                    if (gmaps.endPointMarker && gmaps.startPointMarker) {
                                        gmaps.map.removeLayer(gmaps.endPointMarker);
                                        gmaps.map.removeLayer(gmaps.startPointMarker);
                                    }
                                    if (gmaps.RoutePolyline) {
                                        gmaps.map.removeLayer(gmaps.RoutePolyline);
                                    }


                                    gmaps.map.setZoom(17);

                                    gmaps.map.panTo(gmaps.currentPoint.getLatLng());

                                    /*$rootScope.tooltip.open('Thông báo : kết thúc trình thành công', 4000);*/
                                    toastr.success('路线成功结束');

                                    $rootScope.acceptCustomer = false;
                                    $rootScope.acceptCustomerStart = false;


                                    //window.location.reload();
                                }
                            });
                        }
                    }
                }
            };


            $scope.startRoute = function () {
                if (driver.getDirectionInfo()[0].status == 0) {
                    driver.updateRoute(driver.getDirectionInfo()[0].id, 1, function (err, result) {
                        if (err) {
                            /*showAlert('Thông báo : có lỗi xảy ra !. Không thể bắt đầu lộ trình', 'TaxiGo');*/

                            toastr.success('发生错误，无法结束这条线路');

                        } else {
                            driver.setDirectionInfo([result]);

                            socketIo.emit('taxi:start:route', {
                                roomID: driver.getCurrentRoomID()
                            });

                            var startRouter = '该线路已经启动 !';
                            /*  $rootScope.tooltip.open(startRouter, 5000);*/

                            toastr.success('路线开始');
                            $rootScope.acceptCustomerStart = false;
                        }

                    });
                }
            };


            socketIo.on('customer:calling', function (data) {
                var mess;
                if (navigator.notification) {
                    navigator.notification.beep(1);
                }
                if (driver.getCurrentStatus() !== 1) {


                    console.log('customer:calling', data);
                    start = data.startPoint;
                    end = data.endPoint;
                    mess = '客户请求!';

                    var d = new Date();

                    var bConfirm = confirm(mess);

                    var timeDiff = (new Date() - d);

                    if (timeDiff > maxTimeWait) {
                        var emitDataRemove = {
                            roomID: data.roomID,
                            deviceId: config.deviceId,
                            carLic: auth.getUserName(),
                            taxiId: auth.getUserId()
                        };
                        socketIo.emit('taxi:denied', emitDataRemove);
                        showAlert('您错过了一个客户', '约约');
                    }
                    else if (bConfirm) {

                        angular.forEach(gmaps.listMarkerCustomer, function (v, k) {
                            gmaps.map.removeLayer(v);
                        });
                        data.carLic = auth.getUserName();
                        data.taxiId = auth.getUserId();

                        driver.setCurrentRoomID(data.roomID);
                        socketIo.emit('taxi:accept', data);
                        toastr.success('客户已经预约司机');
                    }
                    else {
                        var emitDataRemove = {
                            roomID: data.roomID,
                            deviceId: config.deviceId,
                            carLic: auth.getUserName(),
                            taxiId: auth.getUserId()
                        };

                        socketIo.emit('taxi:denied', emitDataRemove);
                        console.log("您取消了预定");
                    }
                }
            });


            /*Listening to client socket taxi pick*/


            socketIo.on('customer:choose:me', function (data) {

                console.log('customer:choose:me data', data);

                $scope.$apply(function () {
                    $scope.routeID = data.routeID;
                });
                driver.setCurrentRoomID(data.roomID);
                if (!data.isQuick) {
                    messCustomer = '客户选择了您!起点 : ' + start + ' 终点: ' + end + ' 按 OK 看时间表';

                    if (confirm(messCustomer)) {


                        $rootScope.$apply(function () {
                            $rootScope.acceptCustomer = true;
                            $rootScope.acceptCustomerStart = true;
                        });

                        gmaps.createMarker(data);
                        gmaps.map.panTo(new L.LatLng(data.lat, data.lng));


                        driver.getDirection(data.routeId, function (err, result) {
                            if (result) {
                                console.log('getDirection', result);

                                driver.setCurrentStatus(1);
                                driver.setDirectionInfo(result);
                                $scope.directionInfo.startPoint = result[0].startPoint;
                                $scope.directionInfo.endPoint = result[0].endPoint;
                                $scope.directionInfo.status = result[0].status;

                                if(result[0].startPoint != result[0].endPoint){
                                    gmaps.getDirectionByGeoCode(result[0].startPoint, result[0].endPoint);
                                }



                            } else {
                                console.log('getDirection', err);
                            }
                        });
                    }

                } else {
                    /*$rootScope.tooltip.open('Lộ trình đã bắt đầu');*/
                    toastr.success('路线开始');
                    $rootScope.$apply(function () {
                        $rootScope.acceptCustomer = true;
                        $rootScope.acceptCustomerStart = true;
                    });

                    gmaps.createMarker(data);

                    driver.getDirection(data.routeId, function (err, result) {
                        if (result) {
                            driver.setCurrentStatus(1);
                            driver.setDirectionInfo(result);
                            $rootScope.customerInfo.startPoint = driver.getDirectionInfo()[0].startPoint;
                            $rootScope.customerInfo.endPoint = driver.getDirectionInfo()[0].endPoint;
                            $rootScope.customerInfo.status = driver.getDirectionInfo()[0].status;
                            //console.log('getDirection', result);
                        } else {
                            //console.log('getDirection', err);
                        }
                    });
                }
            });

            window.socketIo.on('customer:destroy:route', function (destroyData) {
                /* if (window.confirm('Khách hàng yêu cầu hủy lộ trình\n với lý do : ' + destroyData.reason
                 + ' . Bạn có đồng ý không ?')) {

                 }*/
                var messDelete = "取消线路原因 : " + destroyData.reason;
                showAlert(messDelete);
                // CM:  Tham số để xác định hủy lộ trình
                $scope.deleteRouter(1);
            });

            socketIoService.on('receipt:message', function (messageData) {
                if (navigator.notification) {
                    navigator.notification.beep(1);
                }
                $scope.listMessage.push(messageData);
                $rootScope.readMess = true;
            });

            gmaps.init();


            loadHistory();


            /*
             * Quick Call Taxi
             * */

            socketIo.on('quick:customer:calling', function (data) {

                var msg = '有客户需要\n' + data.startPoint;


                if (navigator.notification) {
                    navigator.notification.beep(1);
                }
                start = data.startPoint;
                end = data.endPoint;

                var startTime = new Date();

                var bConfirm = window.confirm(msg);

                var timeDiff = (new Date() - startTime);

                if (timeDiff > maxTimeWait) {
                    var rejectData = {
                        roomID: data.roomID,
                        carLic: auth.getUserName()
                    };
                    socketIo.emit('quick:taxi:reject', rejectData);
                    showAlert('您错过了一个客户', '约约');
                }
                else if (bConfirm) {
                    /*angular.forEach(gmaps.listMarkerCustomer, function (v, k) {
                     v.setMap(null);
                     });*/

                    data.carLic = auth.getUserName();
                    data.taxiId = auth.getUserId();

                    driver.setCurrentRoomID(data.roomID);

                    console.log('quick:taxi:accept:request', 'start', true);
                    socketIo.emit('quick:taxi:accept:request', data);
                }
                else {
                    var emitDataRemove = {
                        roomID: data.roomID,
                        carLic: auth.getUserName()
                    };

                    socketIo.emit('quick:taxi:reject', emitDataRemove);
                    console.log("您取消了预定");
                }

                console.log('quick:customer:calling', data);
            });

            load();

        }]);
