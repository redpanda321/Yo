'use strict';
/**
 * Application configs
 *
 */

(function (exports) {
    var remoteHost = 'http://52.36.82.220:6868';
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    exports.appConfig =
    {
        appName: 'TaxiGo',
        apiHost: remoteHost,
        mediaHost: remoteHost,
        socketIoUrl: remoteHost + '/socket.io/socket.io.js',
        deviceId: (window.device) ? device.uuid : 'vsoft.deverlopment12334'
    };

    exports.isMobile = isMobile;

})(typeof exports === 'undefined' ? window : exports);
