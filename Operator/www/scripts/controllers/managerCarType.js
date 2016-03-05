/**
 * Created by TungNguyen on 6/24/2014.
 *
 *
 * *  */
'use strict';

angular.module('itaxiManagerApp')
    .controller('managerHrCtrl', ['$scope', '$logger', '$timeout', '$fetchData', 'appDataStore' , '$baseModel', '$restful', '$http', function ($scope, $logger, $timeout, $fetchData, appDataStore, $baseModel, $restful, $http) {

        $scope.activeForm = 0;

        $scope.dataType = {};
        $scope.selectType = '所有车辆';
        var dataTypeCar;
        $scope.chooseType = function (typeCar) {
            if ('4 坐' == typeCar) {
                $scope.loadSearch(4);
            }
            else if ('7 坐' == typeCar) {
                $scope.loadSearch(7);
            } else {
                $scope.listDriverTypes = dataTypeCar;
            }
        };

        $scope.loadSearch = function (seat) {
            $scope.listDriverTypes = [];
            for (var i = 0; i < dataTypeCar.length; i++) {
                if (dataTypeCar[i].seatNum == seat) {
                    $scope.listDriverTypes.push(dataTypeCar[i]);
                }
            }
        }
        $scope.back = function () {
            $scope.activeForm = 0;
        }
        var loadType = function () {
            if (appDataStore.DriverTypes.size() > 0) {
                $scope.listDriverTypes = appDataStore.DriverTypes.all();
                dataTypeCar = $scope.listDriverTypes;
            } else {
                $fetchData.getData('driverTypes', null, null, null, null).then(function (resp) {
                    $scope.listDriverTypes = resp.all();
                    appDataStore.DriverTypes.addAll(resp.all());
                    dataTypeCar = $scope.listDriverTypes;
                }, function (err) {
                    console.log('err : ', err);
                })
            }
        };

        loadType();


        $scope.createDriverType = function (item) {

            var itemData = new $baseModel('driverTypes', item);
            console.log('item', item);

            itemData.save(function (err, resp) {
                if (!err) {
                    toastr.success('添加成功!');
                    $scope.listDriverTypes.push(itemData);
                    appDataStore.DriverTypes.add(itemData);
                    $scope.back();
                } else {
                    toastr.error('添加失败');
                }
            })
        };
        $scope.deleteDrivertype = function (item, index) {
            console.log('item delete : ', item, index);

            if (window.confirm('想删除: ' + item.username + '吗?')) {
                item.destroy(function (err, result) {
                    if (!err) {
                        toastr.success('删除成功!');
                        $scope.DriverTypes.splice(index, 1);
                        appDataStore.DriverTypes.remove(item);
                    } else {
                        toastr.error('删除失败');
                    }
                })
            }
        };


    }]);
