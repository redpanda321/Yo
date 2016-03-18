'use strict';

angular.module('itaxiManagerApp')
    .controller('detailCrmCtrl', ['$scope', '$logger', '$timeout', '$fetchData', 'appDataStore' , '$baseModel', '$restful', '$http', '$state', '$stateParams',
        function ($scope, $logger, $timeout, $fetchData, appDataStore, $baseModel, $restful, $http, $state, $stateParams) {
            // Required - set to true on submission
            $scope.isSubmitting = null;
            // Required - set to 'success' or 'error' on success/failure
            $scope.result = null;
            // Function run ng-bs-animate-button
            $scope.fakeSubmit = function() {
                $scope.isSubmitting = true;
            };

            $scope.options = {
                buttonDefaultText: '发送消息',
                buttonSubmittingText: '显示提交',
                buttonSuccessText: '发送成功',
                buttonErrorText: '输入Email',
                buttonDefaultClass: 'btn-default',
                buttonSubmittingClass: 'btn-info',
                buttonSuccessClass: 'btn-success'
            };

            $scope.dataSend = {};


            // Function handle when send email.
            $scope.sendMessage = function(dataSend) {
                if (dataSend.receiver != null && dataSend.receiver != '') {
                    $http.post('http://54.187.5.33:6868/sendMail', dataSend)
                        .success(function (data) {
                            // console.log('this is data received:  ',data);
                            dataSend.receiver = '';
                            dataSend.title = '';
                            dataSend.content = '';
                            $scope.result = 'success';
                            // toastr.success(data);
                        })
                        .error(function (err) {
                            toastr.error('err');
                        })
                } else {
                    $scope.result = 'error';
                    $('#nameacc').focus();
                }
            };
    }]);
