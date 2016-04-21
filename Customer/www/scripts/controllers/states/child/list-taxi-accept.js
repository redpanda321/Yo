'use strict';

angular.module('itaxiApp')
    .controller('ListTaxiAcceptCtrl', ['$rootScope', '$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', 'appDataStore', 'routes', '$state', '$timeout', '$q', '$ionicPopup',
        function ($rootScope, $scope, $logger, gmaps, taxi, $fetchData, $auth, appDataStore, routes, $state, $timeout, $q, $ionicPopup) {
            $logger.info('ListTaxiAccept Controller', 'start', true);

            $scope.listTaxi = [];

            var loadListTaxi = function () {
                $scope.listTaxi = appDataStore.collection.listTaxiAccept.all();
                console.log('$scope.listTaxi : ', $scope.listTaxi);
            };


            $scope.listTaxiGroup = [

                {logo: './images/mailinh.png', group: 'Taxi Mai Linh', call: '0438222666', star: 5.0, firstKm: '9.000', secondKm: '12.000'},
                {logo: './images/basao.jpg', group: 'Taxi Ba Sao – Morning', call: '0432202020', star: 4.8, firstKm: '9000', secondKm: '12000'}

                        ];

            /*

             $scope.showConfirm = function () {
             $ionicPopup.confirm({
             title: 'Xác nhận',
             content: 'Bạn có chắc thực hiện cuộc gọi này?'
             }).then(function (res) {
             if (res) {
             console.log('You are sure');
             } else {
             console.log('You are not sure');
             }
             });
             };
             */


            /*
             *  Start controller
             * */
            loadListTaxi();

            $rootScope.$on('taxi:leave:room', function (data) {
                $logger.info('taxi:leave:room', appDataStore.collection.listTaxiAccept.all());
                loadListTaxi();
            });


            $scope.showConfirmCall = function (taxi) {
                $ionicPopup.show({
                    title: '司机 : '+ taxi.fullname,
                    subTitle: '您想看司机信息吗!',
                    scope: $scope,
                    buttons: [
                        { text: '查看', onTap: function (e) {
                            $rootScope.goToPage('app.driverInfo', {id: taxi.id})
                        } },
                        {
                            text: '<b>接受车辆</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                $rootScope.chooseTaxi(taxi);
                            }
                        }
                    ]
                }).then(function (res) {
                    console.log('Tapped!', res);
                }, function (err) {
                    console.log('Err:', err);
                }, function (msg) {
                    console.log('message:', msg);
                });


            };
        }]);