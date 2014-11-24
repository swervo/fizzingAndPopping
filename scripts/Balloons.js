"use strict";

/* global thisApp:false */
/* global Vector:false */

function Balloon (aCanvas, aSourceImage) {
    this.canvas = aCanvas;
    this.sourceImage = aSourceImage;
    this.location = new Vector(thisApp.utils.randomRange(10, this.canvas.width - 10), this.canvas.height);
    this.alpha = thisApp.utils.randomRange(0.5, 1);
    this.popThreshold = thisApp.utils.randomRange(10, 100);
    this.velocity = new Vector(thisApp.utils.randomRange(-0.5, 0.5), thisApp.utils.randomRange(-0.5, -1));
    this.enabled = true;
    this.context = this.canvas.getContext("2d");
}

Balloon.prototype = {
    drag: 1,
    fade: 1,

    update: function() {
        if (!this.enabled) {
            return false;
        }
        this.velocity.multiplyEq(this.drag);
        this.location.plusEq(this.velocity);
        this.alpha *= this.fade;
        if (this.location.y < 0) {
            this.location.y = this.canvas.height;
            this.alpha = thisApp.utils.randomRange(0.1, 0.9);
        }
        if (this.location.x < 0 || this.location.x > this.canvas.width) {
            this.location.x = thisApp.utils.randomRange(0, this.canvas.width);
            this.location.y = this.canvas.height;
        }
        if (this.location.y < this.popThreshold) {
            this.enabled = false;
            thisApp.balloons.makeParticles(10, this.location.x, this.location.y);
            this.location.x = thisApp.utils.randomRange(10, this.canvas.width - 10);
            this.location.y = this.canvas.height;
            this.enabled = true;
        }
        this.draw();
    },
    
    pop: function(aHitLoc) {
        function intersects(x, y, cx, cy, r) {
            var dx, dy;
            dx = x - cx;
            dy = y - cy;
            return (dx*dx+dy*dy <= r*r);
        }
        if (intersects(aHitLoc.locX, aHitLoc.locY, this.location.x, this.location.y, 10)) {
            this.enabled = false;
            thisApp.balloons.makeParticles(10, this.location.x, this.location.y);
            this.location.x = thisApp.utils.randomRange(10, this.canvas.width - 10);
            this.location.y = this.canvas.height;
            this.enabled = true;
        }

    },
    
    
    draw: function() {
        this.context.save();
        // move to the centre of the image
        this.context.translate(this.location.x, this.location.y);
        this.context.translate(this.sourceImage.width * -0.5, this.sourceImage.width * -0.5);
        // set the alpha to the particle's alpha
        this.context.globalAlpha = this.alpha;
        // draw it
        this.context.drawImage(this.sourceImage,0,0);
        this.context.restore();
    }
};

function Balloons(aCanvas, aNum, aSourceImage) {
    this.canvas = aCanvas;
    this.context = this.canvas.getContext("2d");
    this.sourceImage = aSourceImage;
    this.balloonList = [];
    this.burstPs = [];
    this.spareBurstPs = [];
    this.numOfBalloons = aNum;
    this.makeBalloons();
    // console.dir(this.balloonList);
}

Balloons.prototype = {
    
    makeBalloons: function() {
        var i;
        for (i = 0; i < this.numOfBalloons; i++) {
            this.balloonList.push(new Balloon(this.canvas, this.sourceImage));
        }
    },

    update: function() {
        var i;
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (i = 0; i < this.balloonList.length; i++) {
            this.balloonList[i].update();
        }
        this.updateParticles();
    },

    hitTest: function(aHitLoc) {
        //broadcast the hit location to all the balloons on the list
        this.balloonList.forEach(
            function(item) {
                item.pop(aHitLoc);
            }
        );
    },

    makeParticles: function(aNum, partX, partY) {
        var i, particle, angle, speed;
        for(i = 0; i < aNum; i++) {
            if (this.spareBurstPs.length > 0) {
                particle = this.spareBurstPs.pop();
                particle.enabled = true;
                particle.posX = partX;
                particle.posY = partY;
            } else {
                particle = new BurstParticle(partX, partY);
                this.burstPs.push(particle);
            }

            angle = Math.random()* Math.PI * 2;
            speed = Math.random() * 5 + 5;
            // give it a random x and y velocity
            particle.velX = Math.cos(angle)*speed;
            particle.velY = Math.sin(angle)*speed;
            particle.size = thisApp.utils.randomRange(1,1.5);

            particle.drag = 0.85;
            particle.shrink = 0.85;
        }
    },
    
    updateParticles: function() {
        var i, particle;
        for (i = 0; i < this.burstPs.length; i++) {
            particle = this.burstPs[i];
            if(!particle.enabled) {
                continue;
            }
            particle.render(this.context);
            particle.update();
            if (particle.size < 0.001) {
                particle.enabled = false;
                this.spareBurstPs.push(particle);
            }
        }
    }
};
