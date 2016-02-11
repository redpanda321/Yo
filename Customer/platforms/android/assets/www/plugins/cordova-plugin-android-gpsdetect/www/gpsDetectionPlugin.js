cordova.define("cordova-plugin-android-gpsdetect.gpsDetect", function(require, exports, module) {
var exec = require('cordova/exec');

function gpsDetect() { };

gpsDetect.prototype.checkGPS = function (successCallback, failureCallback) {
    exec(successCallback, failureCallback, 'GpsDetectionPlugin', 'gpsDetection', []);
};

gpsDetect.prototype.switchToLocationSettings = function (successCallback, failureCallback) {
    exec(successCallback, failureCallback, 'GpsDetectionPlugin', 'gpsActivation', []);
};

module.exports = new gpsDetect();
});
