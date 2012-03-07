var thisApp = {
    utils: {}
};

(function(aObj) {
    var 
    // canvas elements
    lowerCanvas = document.getElementById("lowerCanvas"),
    topCanvas = document.getElementById("topCanvas"),
    
    // misc
    i, interval, os, eventType, eventHandler,
    
    // functions
    touchHandler, mouseHandler,
    
    bubbleImage = new Image();
    
	bubbleImage.src = "images/bubble.png";
	
	bubbleCanvas = lowerCanvas;
	balloonCanvas = topCanvas;
	
    aObj.utils = {
        updateStage: undefined,

        addToUpdate: function (aFunc, aObj) {
            var oldUpdate = this.updateStage,
            newFun = aObj ? function(){ aFunc.call(aObj); } : aFunc;
            if (typeof this.updateStage !== "function") {
                this.updateStage = newFun;
            } else {
                this.updateStage = function () {
                    oldUpdate();
                    newFun();
                };
            };
        },

        randomRange: function(aMin, aMax) {
            return ((Math.random() * (aMax - aMin)) + aMin);
        },
        
        // These two functions based on the excellent Zepto.js by Thomas Fuchs and other contributors.
        whichOS: function() {
            var os = {}, ua = navigator.userAgent,
            android = ua.match(/(Android)\s+([\d.]+)/),
            iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            webos = ua.match(/(webOS)\/([\d.]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
            if (android) { os.android = true; os.version = android[2]; }
            if (iphone) { os.ios = true; os.version = iphone[2].replace(/_/g, '.'); os.iphone = true; };
            if (ipad) { os.ios = true; os.version = ipad[2].replace(/_/g, '.'); os.ipad = true; };
            if (webos) { os.webos = true; os.version = webos[2]; };
            if (blackberry) { os.blackberry = true; os.version = blackberry[2]; };
            return os;
        },
        
        isWebkit: function() {
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
interval = setInterval(aObj.utils.updateStage, 1000/30);
os = aObj.utils.whichOS();

touchHandler = function(e) {
    var touchEvent = e.touches[0], hitPoint = {};
    if (touchEvent.target.id === "topCanvas") {
        hitPoint.locX = touchEvent.pageX;
        hitPoint.locY = touchEvent.pageY;
        // take the coordinates and pass them to the Balloons handler
        aObj.balloons.hitTest(hitPoint);
    }
    if ((touchEvent.pageY > 200 && touchEvent.pageY < 280) && (touchEvent.pageX > 30 && touchEvent.pageX < 290)) {
        if (navigator.onLine) {
            window.open("http://sebleedelisle.com/training", "_blank");
        } else {
            alert("offline - links don't work");
        }
    };
    if ((touchEvent.pageY > 460) && (touchEvent.pageX > 200)) {
        if (navigator.onLine) {
            window.open("http://twitter.com/swervo", "_blank");
        } else {
            alert("offline - links don't work");
        }
    };
    // prevent scrolling and enable :active pseudo-class
    e.stopPropagation();
    e.preventDefault();
};

mouseHandler = function(e) {
    if (navigator.onLine) {
        if (e.target.id === "author") {
            window.open("http://twitter.com/swervo", "_blank");
        } else if (e.target.id === "topCanvas") {
            var hitPoint = {};
            hitPoint.locX = e.offsetX;
            hitPoint.locY = e.offsetY;
            // take the coordinates and pass them to the Balloons handler
            aObj.balloons.hitTest(hitPoint);
        } else if ((e.pageY > 200 && e.pageY < 280) && (e.pageX > 30 && e.pageX < 290)) {
            window.open("http://sebleedelisle.com/training", "_blank");
        };
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
window.addEventListener("DOMContentLoaded", function(){
    setTimeout(function(){
        window.scrollTo(0,0);
    }, 500);
}, true);

})(thisApp);
