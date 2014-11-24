"use strict";

/* global Vector:false */
/* global thisApp:false */

function Bubble(aLoc, aAlpha, aScale, aCanvas, aContext, aSourceImage) {
    this.location = aLoc;
    this.alpha = aAlpha;
    this.scale = aScale;
    this.canvas = aCanvas;
    this.context = aContext;
    this.sourceImage = aSourceImage;
    this.velocity = new Vector(thisApp.utils.randomRange(-1, 1), thisApp.utils.randomRange(-5, -15));
}

Bubble.prototype = {
    drag: 1,
    fade: 0.95,

    update: function() {
        this.velocity.multiplyEq(this.drag);
        this.location.plusEq(this.velocity);
        this.alpha *= this.fade;
        if (this.location.y < 0) {
            this.location.y = this.canvas.height;
            this.location.x = thisApp.utils.randomRange(5, this.canvas.width - 5);
            this.scale = thisApp.utils.randomRange(0.5, 0.9);
            this.alpha = thisApp.utils.randomRange(0.1, 0.9);
        }
        if (this.location.x < 0 || this.location.x > this.canvas.width) {
            this.location.x = thisApp.utils.randomRange(5, this.canvas.width - 5);
        }
        this.draw();
    },
    
    draw: function() {
        this.context.save();
        // move to the centre of the image
        this.context.translate(this.location.x, this.location.y);
        this.context.scale(this.scale,this.scale);
        this.context.translate(this.sourceImage.width * -0.5, this.sourceImage.width * -0.5);
        // set the alpha to the particle's alpha
        this.context.globalAlpha = this.alpha;
        // draw it
        this.context.drawImage(this.sourceImage,0,0);
        this.context.restore();
    }
};

function Bubbles(aCanvas, aNum, aSourceImage) {
    this.canvas = aCanvas;
    this.sourceImage = aSourceImage;
    this.context = this.canvas.getContext("2d");
    this.bubbleList = [];
    this.numOfBubbles = aNum;
    this.makeBubbles();
}

Bubbles.prototype = {
    makeBubbles: function() {
        var i, pos;
        for (i = 0; i < this.numOfBubbles; i++) {
            pos = new Vector(thisApp.utils.randomRange(5, this.canvas.width - 5), this.canvas.height);
            this.bubbleList.push(
                new Bubble(
                    pos,
                    thisApp.utils.randomRange(0.3, 0.9),
                    thisApp.utils.randomRange(0.5, 0.9),
                    this.canvas,
                    this.context,
                    this.sourceImage
                )
            );
        }
    },

    update: function() {
        var i;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(i = 0; i < this.bubbleList.length; i++) {
            this.bubbleList[i].update();
        }
    }
};
