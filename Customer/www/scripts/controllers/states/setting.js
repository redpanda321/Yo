'use strict';

angular.module('itaxiApp')
    .controller('SettingCtrl', ['$scope', '$rootScope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', '$ionicActionSheet', 'appConfig', '$upload', '$restful', '$ionicLoading',
        function ($scope, $rootScope, $logger, gmaps, taxi, $fetchData, $auth, $ionicActionSheet, appConfig, $upload, $restful, $ionicLoading) {
            $logger.info('Setting Controller', 'start', true);

            //get User from $auth

            $auth.getUserInfoById($auth.getUserId(), function (err, result){
                if(!err){
                    $logger.info('getUserInfoById', 'success', result);
                    $scope.UserInfo = result;
                }else {
                    $logger.info('getUserInfoById', 'success', false);
                }
            });
            $scope.disableButtonSave = false;

            $scope.openSelectFile = function () {
                var avtFile = document.getElementById("avatarFile");
                avtFile.click();
            };

            // get avatar

            $scope.getAvt = function (url) {
                if (url) {
                    return appConfig.mediaHost + '/' + url;
                } else {
                    return '/vendor/img/food.png';
                }
            };

            // change cover
            $scope.showActionsheet = function () {

                $ionicActionSheet.show({
                    titleText: '更换头像',
                    buttons: [
                        { text: '拍一张新照片' },
                        { text: '从相册中选取' }
                    ],
                    cancelText: '取消',
                    cancel: function () {
                        console.log('CANCELLED');
                    },
                    buttonClicked: function (index) {
                        if (index == 0) { // Take new picture
                            $scope.takePicture($scope.UserInfo);
                            return true;
                        } else if (index == 1) { // Load from device
                            $scope.openSelectFile();
                            return true;
                        }
                    },
                    destructiveButtonClicked: function () {
                        console.log('DESTRUCT');
                        return true;
                    }
                });
            };

            // angular file upload
            $scope.onFileSelect = function ($files, userInfo) {

                $ionicLoading.show({
                    content: '上载 .. ',
                    animation: 'fade-in',
                    showBackdrop: false,
                    maxWidth: 200
                });

                $logger.info('onFileSelect', 'start', true);
                $scope.uploadProcessing = true;
                $scope.urlImg = '';
                //$files: an array of files selected, each file has name, size, and type.

                var $file;

                for (var i = 0; i < $files.length; i++) {
                    $file = $files[i];
                    $logger.info('onFileSelect', '$file', $file);
                }

                $logger.debug('onFileSelect', '$file', $file);

                $logger.info('onFileSelect', '$upload', $upload);

                $scope.upload = $upload
                    .upload({
                        //url: appConfig.mediaHost + '/uploadFile', //upload.php script, node.js route, or servlet url
                    url:appConfig.mediaHost + '/file-upload', //upload.php script, node.js route, or servlet url
                    method: 'POST',// or PUT,
                        // headers: {'headerKey': 'headerValue'}, withCredential: true,
                        data: {tableName: 'menuData'},
                        file: $file
                        /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                        //fileFormDataName: myFile,
                        /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                        //formDataAppender: function(formData, key, val){}
                    })
                    .progress(function (evt) {
                        $logger.info('onFileSelect', 'percent', parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function (data) { //.success(function(data, status, headers, config) {
                        $logger.debug('onFileSelect', 'data', data);


                        if (data.success) {
                            $logger.info('onFileSelect', 'success', true);
                            userInfo.avatar = data.url;
                            $logger.info('onFileSelect', 'success', data.url);
                            $scope.uploadProcessing = false;


                            $ionicLoading.show({
                                content: 'Upload successful !',
                                animation: 'fade-in',
                                showBackdrop: false,
                                maxWidth: 200
                            });


                            setTimeout(function () {
                                $ionicLoading.hide();
                            }, 500);
                        }
                    });
                //.error(...)
                //.then(success, error, progress);
            };


            var upload = function (imageURI, userInfo) {
                $ionicLoading.show({
                    content: '上载中 .. ',
                    animation: 'fade-in',
                    showBackdrop: false,
                    maxWidth: 200
                });
                console.log('come upload');

                var ft = new FileTransfer(),
                    options = new FileUploadOptions();

                options.fileKey = 'file';
                options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
                options.mimeType = 'image/jpeg';
                options.chunkedMode = false;
                options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                    tableName: 'menuData'
                };

                ft.upload(imageURI, appConfig.mediaHost + '/file-upload',
                    function (data) {
                        console.log('Upload success');
                        //logger.info('upload', 'arguments', arguments);
                        //logger.info('upload', 'resp', resp);

                        var response = data.response;
                        response = JSON.parse(response);

                        console.log(response);
                        //logger.info('upload', 'response', response.success);
                        //logger.info('upload', 'response', response.url);

                        if (response.success === true) {
                            $logger.info('upload', 'response.success', response.success);
                            $ionicLoading.show({
                                content: '上载成功 !',
                                animation: 'fade-in',
                                showBackdrop: false,
                                maxWidth: 200
                            });

                            setTimeout(function () {
                                $ionicLoading.hide();
                            }, 500);

                            $scope.$apply(function () {
                                userInfo.avatar = response.data.url;
                            });
                        } else {
                            $ionicLoading.show({
                                content: '上载失败! !',
                                animation: 'fade-in',
                                showBackdrop: false,
                                maxWidth: 200
                            });

                            setTimeout(function () {
                                $ionicLoading.hide();
                            }, 500);
                        }
                    },
                    function (e) {
                        //alert("Upload failed");
                        console.log('Upload failed');
                        console.log(arguments);
                    }, options);
            };


            $scope.takePicture = function (userInfo) {
                var options = {
                    quality: 45,
                    targetWidth: 1000,
                    targetHeight: 1000,
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG,
                    sourceType: Camera.PictureSourceType.CAMERA
                };

                navigator.camera.getPicture(
                    function (imageURI) {
                        console.log(imageURI);
                        upload(imageURI, userInfo);
                    },
                    function (message) {
                        // We typically get here because the use canceled the photo operation. Fail silently.
                    }, options);

                return false;
            };

            // save user information (API document)

            $scope.saveUserInfo = function (userInfo) {
                $scope.disableButtonSave = true;
                $ionicLoading.show({
                    content: '请稍等 ..',
                    animation: 'fade-in',
                    showBackdrop: false,
                    maxWidth: 200
                });

                delete userInfo.hash;
                delete userInfo.salt;


                $restful.put({table: 'Users', id: $auth.getAppRegisterInfo().id}, userInfo, function (resp) {
                    $logger.info('updateRoute', 'resp', resp);
                    if (resp.success) {

                        $logger.info('saveUserInfo', 'success', resp.data);


                        $auth.setAppRegister(resp.data);
                        $scope.UserInfo = resp.data;
                        $rootScope.currentUserInfo = resp.data;


                        $ionicLoading.show({

                            content: '更新成功 !'

                        });
                        setTimeout(function () {
                            $ionicLoading.hide();
                            $scope.disableButtonSave = false;
                        }, 1000)
                    } else {

                        $ionicLoading.show({
                            content: '发生错误 !'
                        });

                        setTimeout(function () {
                            $ionicLoading.hide();
                            $scope.disableButtonSave = false;
                        }, 1000)
                    }
                });
            }

        }]);