'use strict';

angular.module('itaxiApp')
    .controller('messageDetailCtrl', ['$rootScope', '$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', 'appDataStore', '$socketIo', 'appConfig', '$ionicModal', '$stateParams', '$restful', '$baseModel',
        function ($rootScope, $scope, $logger, gmaps, taxi, $fetchData, $auth, appDataStore, $socketIo, appConfig, $ionicModal, $stateParams, $restful, $baseModel) {

            $logger.info('Message Controller', 'start', true);
            // get id from URL with ui-router
            var taxiId = $stateParams.id;
            $scope.messageDetail = {};



            var loadMessage = function () {

                // use utils async waterfall
                // step 1 load message
                async.waterfall([
                    function (cb) {
                        // check data form AppDataStore
                        if (appDataStore.messageData.size()) {
                            if (appDataStore.messageData.get(taxiId)) {
                                $scope.messageDetail = appDataStore.messageData.get(taxiId);
                                cb(null, $scope.messageDetail);
                            } else {
                                $rootScope.notify('上载 ...', true);
                                $restful.get({table: 'MessageRelation', id: taxiId}, function (resp) {
                                    if (resp.success) {
                                        $scope.messageDetail = new $baseModel('MessageRelation', resp.data[0]);
                                        cb(null, $scope.messageDetail);
                                    }else {
                                        cb(resp.message, null);
                                    }
                                });
                            }
                        } else {
                            $rootScope.notify('上载 ...', true);
                            $restful.get({table: 'MessageRelation', id: taxiId}, function (resp) {

                                if (resp.success) {

                                    $scope.messageDetail = new $baseModel('MessageRelation', resp.data[0]);
                                    cb(null, $scope.messageDetail);
                                } else {
                                    cb(resp.message, null);
                                }

                            });
                        }
                    },
                    // step 2
                    function (message, cb){

                        if(message.readed == 0){
                            message.readed = 1;
                            message.save(function (err, result){
                                cb(err, result);
                            })
                        }else {
                            cb(null, message);
                        }
                    }
                ], function (err, result){
                    if(err){
                        console.log('Error', err);
                    }else {
                        console.log('success', result);
                    }
                });

            };


            loadMessage();
        }]);