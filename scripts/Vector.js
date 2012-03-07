
var Vector = function (x,y) {
	this.x = x || 0; 
	this.y = y || 0; 
};

Vector.prototype = {

	reset: function ( x, y ) {
		this.x = x;
		this.y = y;
		return this;
	},

	toString: function (decPlaces) {
	 	decPlaces = decPlaces || 3; 
		var scalar = Math.pow(10,decPlaces); 
		return "[" + Math.round (this.x * scalar) / scalar + ", " + Math.round (this.y * scalar) / scalar + "]";
	},
	
	clone: function () {
		return new Vector(this.x, this.y);
	},
	
	copyTo: function (v) {
		v.x = this.x;
		v.y = this.y;
	},
	
	copyFrom: function (v) {
		this.x = v.x;
		this.y = v.y;
	},	
	
	magnitude: function () {
		return Math.sqrt((this.x*this.x)+(this.y*this.y));
	},
	
	magnitudeSquared: function () {
		return (this.x*this.x)+(this.y*this.y);
	},
	
	normalise: function () {
		var m = this.magnitude();
		this.x = this.x/m;
		this.y = this.y/m;
		return this;	
	},
	
	reverse: function () {
		this.x = -this.x;
		this.y = -this.y;
		return this; 
	},
	
	plusEq: function (v) {
		this.x += v.x;
		this.y += v.y;
		return this; 
	},
	
	plusNew: function (v) {
	    return new Vector(this.x + v.x, this.y + v.y); 
	},
	
	minusEq: function (v) {
	    this.x -= v.x;
		this.y -= v.y;
		return this; 
	},

	minusNew: function (v) {
	 	return new Vector(this.x - v.x, this.y - v.y); 
	},	
	
	multiplyEq: function (scalar) {
		this.x *= scalar;
		this.y *= scalar;
		return this; 
	},
	
	multiplyNew: function (scalar) {
		var returnvec = this.clone();
		return returnvec.multiplyEq(scalar);
	},
	
	divideEq: function (scalar) {
		this.x /= scalar;
		this.y /= scalar;
		return this; 
	},
	
	divideNew: function (scalar) {
		var returnvec = this.clone();
		return returnvec.divideEq(scalar);
	},

	dot: function (v) {
		return (this.x * v.x) + (this.y * v.y) ;
	},
	
	angle: function (useRadians) {
		return Math.atan2(this.y,this.x) * (useRadians ? 1 : VectorConst.TO_DEGREES);
	},
	
	rotate: function (angle, useRadians) {
		var cosRY = Math.cos(angle * (useRadians ? 1 : VectorConst.TO_RADIANS));
		var sinRY = Math.sin(angle * (useRadians ? 1 : VectorConst.TO_RADIANS));
		VectorConst.temp.copyFrom(this); 
		this.x= (VectorConst.temp.x * cosRY) - (VectorConst.temp.y * sinRY);
		this.y= (VectorConst.temp.x * sinRY) + (VectorConst.temp.y * cosRY);
		return this; 
	},	
		
	equals: function (v) {
		return((this.x == v.x) && (this.y == v.x));
	},
	
	isCloseTo: function (v, tolerance) {	
		if (this.equals(v)) {
		    return true;
	    }
		VectorConst.temp.copyFrom(this); 
		VectorConst.temp.minusEq(v); 
		return (VectorConst.temp.magnitudeSquared() < tolerance * tolerance);
	},
	
	rotateAroundPoint: function (point, angle, useRadians) {
		VectorConst.temp.copyFrom(this); 
		//trace("rotate around point "+t+" "+point+" " +angle);
		VectorConst.temp.minusEq(point);
		//trace("after subtract "+t);
		VectorConst.temp.rotate(angle, useRadians);
		//trace("after rotate "+t);
		VectorConst.temp.plusEq(point);
		//trace("after add "+t);
		this.copyFrom(VectorConst.temp);
	}, 
	
	isMagLessThan: function (distance) {
		return(this.magnitudeSquared() < distance * distance);
	},
	
	isMagGreaterThan: function (distance) {
		return(this.magnitudeSquared() > distance * distance);
	},
	
	projectOnto: function(v) {
	   var dp = dot(v),
	   f = dp/(v.x * v.x + v.y * v.y);
	   return new Vector(f * v.x, f * v.y);
	},
	
	convertToNormal: function() {
       var tempx = x;
       x = -y;
       y = tempx;
	},
	
	getNormal: function() {
	   return new Vector(-y, x);
	},
	
	getClosestPointOnLine: function(vectorPos, targetPoint) {
	   var m1 = y/x,
	   m2 = x/-y,
	   b1 = vectorPos.y - (m1 * vectorPos.x),
	   b2 = targetPoint.y - (m2 * targetPoint.x),
	   cx = (b2 - b1)/(m1 - m2),
	   cy = m1 * cx + b1;
	   
	   return new Vector(cx, cy);
	}

};

VectorConst = {
	TO_DEGREES : 180 / Math.PI,		
	TO_RADIANS : Math.PI / 180,
	temp : new Vector()
};
