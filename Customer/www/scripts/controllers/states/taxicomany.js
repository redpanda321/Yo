'use strict';

angular.module('itaxiApp')
    .controller('TaxiCompanyCtrl', ['$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', '$timeout', '$q', '$ionicPopup', '$restful', function ($scope, $logger, gmaps, taxi, $fetchData, $auth, $timeout, $q, $ionicPopup, $restful) {
        $logger.info('TaxiCompany Controller', 'start', true);

        // list Taxi company from TaxiCompany

        $scope.listTaxiGroup = [
          
            { logo: './images/logo-itaxi-new.png', group: 'YoYo Group', call: '4038183581', star: 4.5, firstKm: '5', secondKm: '5' }
        ];

        /*$fetchData.getData('TaxiCompany').then(function (resp) {
            if (resp) {
                console.log('Data company : ', resp.all());
                //5343c72a365cfcaf0930c418
            } else {
                console.log('err');
            }
        });*/


    }]);