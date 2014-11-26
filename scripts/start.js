/* global Balloons:false */
/* global Bubbles:false */

"use strict";

var thisApp = {
    utils: {}
};

(function (aObj) {
    var bubbleCanvas = document.getElementById("bubbleCanvas");
    var balloonCanvas = document.getElementById("balloonCanvas");

    // misc
    var interval, os, eventType, eventHandler;

    var bubbleImage = new Image();

    bubbleImage.src = "images/bubble.png";

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
                os.version = iphone[2].replace(/_/g, ".");
                os.iphone = true;
            }
            if (ipad) {
                os.ios = true;
                os.version = ipad[2].replace(/_/g, ".");
                os.ipad = true;
            }
            if (webos) {
                os.webos = true;
                os.version = webos[2];
            }
            if (blackberry) {
                os.blackberry = true;
                os.version = blackberry[2];
            }
            return os;
        },

        setCanvasDimensions: function (aCanvas) {
            var boundingRect = aCanvas.getBoundingClientRect();
            this.canvasHeight = boundingRect.height;
            this.canvasWidth = boundingRect.width;
        },

        normaliseLoc: function (aLoc) {
            var nLoc = {};
            nLoc.locX = aLoc.locX * 320/this.canvasWidth;
            nLoc.locY = aLoc.locY * 229/this.canvasHeight;
            return (nLoc);
        },

        isWebkit: function () {
            var webkitVersion = navigator.userAgent.match(/WebKit\/([\d.]+)/);
            return webkitVersion ? true : false;
        },

        FULL_CIRCLE: Math.PI * 2
    };

    aObj.utils.setCanvasDimensions(balloonCanvas);

    // BUBBLES
    aObj.bubbles = new Bubbles(bubbleCanvas, 18, bubbleImage);

    // POPPING
    aObj.balloons = new Balloons(balloonCanvas, 8, bubbleImage);

    // add the update functions to the handler
    aObj.utils.addToUpdate(aObj.bubbles.update, aObj.bubbles);
    aObj.utils.addToUpdate(aObj.balloons.update, aObj.balloons);
    interval = setInterval(aObj.utils.updateStage, 1000 / 30);
    os = aObj.utils.whichOS();

    function eventHandler (e) {
        var event = e;
        if (os.ios || os.android) {
            event = e.touches[0];
        }
        if (event.target.id === "balloonCanvas") {
            // take the coordinates and pass them
            // to the Balloons handler after normalising
            var nPoint = aObj.utils.normaliseLoc({
                locX: event.pageX,
                locY: event.pageY
            });
            aObj.balloons.hitTest(nPoint);
        }
    }

    eventType = (os.ios || os.android) ? "touchstart" : "click";

    document.addEventListener(eventType, eventHandler, false);
    // prevent scrolling and enable :active pseudo-class
    document.addEventListener("touchmove", function(e) {
        e.preventDefault();
    });
    // for when running in CSS media query test rig
    // see: http://www.papersnail.co.uk/sandbox/shell/index.html
    window.addEventListener("message", function(e) {
        if (e.data === "frameResize") {
            document.location.reload();
        }
    });

})(thisApp);