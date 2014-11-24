/* global Balloons:false */
/* global Bubbles:false */

"use strict";

var thisApp = {
    utils: {}
};

(function (aObj) {
    var lowerCanvas = document.getElementById("lowerCanvas");
    var topCanvas = document.getElementById("topCanvas");

    // misc
    var interval, os, eventType, eventHandler;

    var bubbleImage = new Image();

    bubbleImage.src = "images/bubble.png";

    var bubbleCanvas = lowerCanvas;
    var balloonCanvas = topCanvas;

    aObj.utils = {
        updateStage: undefined,

        addToUpdate: function (aFunc, aObj) {
            var oldUpdate = this.updateStage,
                newFun = aObj ? function () {
                    aFunc.call(aObj);
                } : aFunc;
            if (typeof this.updateStage !== "function") {
                this.updateStage = newFun;
            } else {
                this.updateStage = function () {
                    oldUpdate();
                    newFun();
                };
            }
        },

        randomRange: function (aMin, aMax) {
            return ((Math.random() * (aMax - aMin)) + aMin);
        },

        // These two functions based on the excellent Zepto.js by Thomas Fuchs and other contributors.
        whichOS: function () {
            var os = {},
                ua = navigator.userAgent,
                android = ua.match(/(Android)\s+([\d.]+)/),
                iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/),
                ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
                webos = ua.match(/(webOS)\/([\d.]+)/),
                blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
            if (android) {
                os.android = true;
                os.version = android[2];
            }
            if (iphone) {
                os.ios = true;
                os.version = iphone[2].replace(/_/g, '.');
                os.iphone = true;
            };
            if (ipad) {
                os.ios = true;
                os.version = ipad[2].replace(/_/g, '.');
                os.ipad = true;
            };
            if (webos) {
                os.webos = true;
                os.version = webos[2];
            };
            if (blackberry) {
                os.blackberry = true;
                os.version = blackberry[2];
            };
            return os;
        },

        isWebkit: function () {
            var webkitVersion = navigator.userAgent.match(/WebKit\/([\d.]+)/);
            return webkitVersion ? true : false;
        },

        FULL_CIRCLE: Math.PI * 2
    };

    // BUBBLES
    aObj.bubbles = new Bubbles(bubbleCanvas, 18, bubbleImage);

    // POPPING
    aObj.balloons = new Balloons(balloonCanvas, 8, bubbleImage);

    // add the update functions to the handler
    aObj.utils.addToUpdate(aObj.bubbles.update, aObj.bubbles);
    aObj.utils.addToUpdate(aObj.balloons.update, aObj.balloons);
    interval = setInterval(aObj.utils.updateStage, 1000 / 30);
    os = aObj.utils.whichOS();

    function touchHandler (e) {
        var touchEvent = e.touches[0],
            hitPoint = {};
        if (touchEvent.target.id === "topCanvas") {
            hitPoint.locX = touchEvent.pageX;
            hitPoint.locY = touchEvent.pageY;
            // take the coordinates and pass them to the Balloons handler
            aObj.balloons.hitTest(hitPoint);
        }
        // prevent scrolling and enable :active pseudo-class
        e.stopPropagation();
        e.preventDefault();
    };

    function mouseHandler (e) {
        if (navigator.onLine) {
            if (e.target.id === "author") {
                window.open("http://twitter.com/swervo", "_blank");
            } else if (e.target.id === "topCanvas") {
                var hitPoint = {};
                hitPoint.locX = e.offsetX;
                hitPoint.locY = e.offsetY;
                // take the coordinates and pass them to the Balloons handler
                aObj.balloons.hitTest(hitPoint);
            }
        } else {
            // seems that navigator.onLine always returns true on the desktop
            alert("offline");
        }
        e.stopPropagation();
        e.preventDefault();
    };

    eventType = "click";
    eventHandler = mouseHandler;

    if (os.ios || os.android || os.webos || os.blackberry) {
        eventType = "touchstart";
        eventHandler = touchHandler;
    };

    document.addEventListener(eventType, eventHandler, false);

    //hide the address bar in mobile safari
    window.addEventListener("DOMContentLoaded", function () {
        setTimeout(function () {
            window.scrollTo(0, 0);
        }, 500);
    }, true);

})(thisApp);