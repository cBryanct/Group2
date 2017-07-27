
/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */
 
"use strict";  // Operate in Strict mode such that variables must be declared before used!
function Shield(spriteTexture,XPos,YPos){
    this.kDelta = 0.2;
    this.mShield = new SpriteRenderable(spriteTexture);
    this.mShield.setColor([1, 1, 1, 0]);
    this.mShield.getXform().setPosition(XPos, YPos);
    this.mShield.getXform().setSize(9, 9);
    this.mShield.setElementPixelPositions(0,256, 0, 256);
    this.mExpired = false;
    GameObject.call(this, this.mShield);
}
gEngine.Core.inheritPrototype(Shield, GameObject);

Shield.prototype.setExpired = function() {
    this.mExpired = true;
};
Shield.prototype.hasExpired = function() {
    return this.mExpired;
};

