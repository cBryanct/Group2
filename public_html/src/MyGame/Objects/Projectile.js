/* File: Projectile.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, Renderable,BoundingBox, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

Projectile.kSpeed = 120 / (0.8 * 60);  
        // across the entire screen in 0.5 seconds
Projectile.kTexture = null;

function Projectile(x, y, Power) {
    this.kPower = Power;  
    this.kRefWidth = 1.5;
    this.kRefHeight = 1.5;
            
    this.kDetectThreshold = 10;
    this.kChaseThreshold = 2 * this.kDetectThreshold;
    
    var r = new TextureRenderable(Projectile.kTexture);
    r.setColor([0.8, 1, 0.8, 0.1]);
    r.getXform().setPosition(x, y);
    r.getXform().setSize(this.kRefWidth, this.kRefHeight);
    GameObject.call(this, r);
    
    this.setCurrentFrontDir([0, -1]);
    this.setSpeed(Projectile.kSpeed);
    
    // Expired to remove
    this.mExpired = false;
}
gEngine.Core.inheritPrototype(Projectile, GameObject);

Projectile.prototype.setExpired = function() {
    this.mExpired = true;
};
Projectile.prototype.hasExpired = function() {
    return this.mExpired;
};


Projectile.prototype.update = function(Hero, StoneSet, aCamera) {
    GameObject.prototype.update.call(this);
    var hit = false;
    //delete Projectile when it is out of camera
    if (aCamera.collideWCBound(this.getXform(), 1.1) !== 
            BoundingBox.eboundCollideStatus.eInside){
            this.setExpired();
    }
    var p = vec2.fromValues(0, 0);
    //collision with stones
    var i, obj;
    for (i=0; i<StoneSet.size(); i++) {
        obj = StoneSet.getObjectAt(i);
        if (this.pixelTouches(obj, p)) {
            this.setExpired();
            obj.decreaseHP(this.kPower);
            hit = true;
        }
    }
    //collision with Hero
    if (this.pixelTouches(Hero, p)) {
            this.setExpired();
            Hero.decreaseHP(this.kPower);
    }
    return hit;
};