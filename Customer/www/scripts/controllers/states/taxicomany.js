'use strict';

angular.module('itaxiApp')
    .controller('TaxiCompanyCtrl', ['$scope', '$logger', 'gmaps', 'taxi', '$fetchData', '$auth', '$timeout', '$q', '$ionicPopup', '$restful', function ($scope, $logger, gmaps, taxi, $fetchData, $auth, $timeout, $q, $ionicPopup, $restful) {
        $logger.info('TaxiCompany Controller', 'start', true);

        // list Taxi company from TaxiCompany

        $scope.listTaxiGroup = [
<<<<<<< HEAD
            { logo: './images/mailinh.png', group: 'Mai Linh Taxi', call: '0438222666', star: 5.0, firstKm: '9.000', secondKm: '12.000' },
            { logo: './images/basao.jpg', group: 'Taxi Three Stars - Morning', call: '0432202020', star: 4.8, firstKm: '9000', secondKm: '12000' },
            { logo: './images/logo-itaxi-new.png', group: 'Taxi Thanh Loi', call: '0438551551', star: 4.5, firstKm: '9000', secondKm: '12000' }
=======
          
            { logo: './images/logo-itaxi-new.png', group: 'YoYo Group', call: '4038183581', star: 4.5, firstKm: '5', secondKm: '5' }
>>>>>>> c5f7a774f8cbeda3e860eb52346696b8edb78726
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