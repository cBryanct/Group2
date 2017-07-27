/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */
 
"use strict";  // Operate in Strict mode such that variables must be declared before used!
function Stone(spriteTexture,XPos,YPos){
    this.speedUp = 0.1;
    this.kDelta = 0.5*Math.random()+this.speedUp;
    this.angle = 180*Math.random();
    this.mStone = new SpriteRenderable(spriteTexture);
    this.mStone.setColor([1, 1, 1, 0]);
    this.mStone.getXform().setPosition(XPos, YPos);
    this.mStone.getXform().setSize(12, 9.6);
    this.mStone.setElementPixelPositions(0,256, 0, 256);
    this.mExpired = false;
    this.mHP = 5;
    GameObject.call(this, this.mStone);
}
gEngine.Core.inheritPrototype(Stone, GameObject);

Stone.prototype.setExpired = function() {
    this.mExpired = true;
};
Stone.prototype.hasExpired = function() {
    return this.mExpired;
};
Stone.prototype.decreaseHP = function(num) {
    this.mHP = this.mHP - num;
};

