/* File: Hero.js 
 *
 * Creates and initializes the Hero (Dye)
 * overrides the update function of GameObject to define
 * simple Dye behavior
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObject, SpriteRenderable, vec2 */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
var shield = shield;//盾牌图片
function Hero(spriteTexture, aPath, atX, atY) {
    this.kDelta = 0.6;
    this.mHP = 5;
    this.mPower = 1;
    this.mDye = new SpriteRenderable(spriteTexture);
    this.mDye.setColor([1, 1, 1, 0]);
    this.mDye.getXform().setPosition(atX, atY);
    this.mDye.getXform().setZPos(0);
    this.mDye.getXform().setSize(10, 10);
    this.mDye.setElementPixelPositions(0, 256, 0, 256);
    GameObject.call(this, this.mDye);
    
    // Support for following the path
    this.mPath = aPath;
    this.mPathIndex = 0;
    this.mCurrentPathLength = 0;
    this.mCurrentStartPos = null;
    this._stopMovement();
    
    // Cover line segment in x-seconds
    this.mCoverInSeconds = 2;
    this.mHit = 0;
    this.mNumDestroy = 0;
    
    // Projectiles that the hero can shoot
    this.mProjectiles = new ProjectileSet();
    
    
    this.moveUp = gEngine.Input.keys.W;
    this.moveLeft = gEngine.Input.keys.A;
    this.moveDown = gEngine.Input.keys.S;
    this.moveRight = gEngine.Input.keys.D;
    
    this.shotKey = gEngine.Input.keys.Space;
    
    
    
    this.shieldCount = 0;
    
    this.mShield = new TextureRenderable(shield);
    this.mShield.setColor([1, 1, 1, 0]);
    this.mShield.getXform().setPosition(atX, atY);
    this.mShield.getXform().setSize(9, 9);
    
    this.shieldCanDraw = false;//盾牌是否可以使用，没有按使用键之前不绘制盾牌
}
gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.setShotKey = function(shot){
    this.shotKey = shot;
};
Hero.prototype.setMoveKeys = function(up,left,down,right){
    this.moveUp = up;
    this.moveLeft = left;
    this.moveDown = down;
    this.moveRight = right;
};
Hero.prototype.setSpeed = function(Speed){
    this.kDelta = Speed;  
};
Hero.prototype.setPower = function(Power){
    this.mPower = Power;
};
Hero.prototype.update = function(OtherHero, StoneSet, aCamera) {
    //calculate HP
    if(this.mHP <= 0){
        gEngine.GameLoop.stop();
    }
    
    // update Projectile
    var num = this.mProjectiles.update(OtherHero, StoneSet, aCamera);
    this.mNumDestroy += num; 
    
    // update hero path
    this._updatePath();
    
    // movement
    this._moveByKeys(); 
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up))
        this.mCoverInSeconds -= this.kDelta;
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down))
        this.mCoverInSeconds += this.kDelta;
    
    if (gEngine.Input.isKeyClicked(this.shotKey)) {
        this.mProjectiles.newAt(this.getXform().getPosition(),this.mPower);
    }
  
};
Hero.prototype.updateWithShield = function(ShieldSet) {
    
    
    if(gEngine.Input.isKeyPressed(gEngine.Input.keys.Q)){
        if(this.shieldCanDraw === false){
            if(this.shieldCount>0){
                this.shieldCanDraw = true;
                this.shieldCount --;
            }
        }
    }
    var p = vec2.fromValues(0, 0);
    for (var i=0; i<ShieldSet.size(); i++) {
        var obj = ShieldSet.getObjectAt(i);
        if (this.pixelTouches(obj, p)) {
            this.shieldCount ++;
            ShieldSet.removeFromSet(obj);
        }
    }
    
    this.mShield.getXform().setPosition(
            this.mDye.getXform().getXPos(),
            this.mDye.getXform().getYPos()
        );
};


Hero.prototype.draw = function(aCamera) {
    GameObject.prototype.draw.call(this, aCamera);
    this.mProjectiles.draw(aCamera);
    
    if(this.shieldCanDraw===true)
        this.mShield.draw(aCamera);
};


Hero.prototype.hitOnce = function() {
    this.mHit++;
};

Hero.prototype.getStatus = function(){
    return  "Hero Hit: " + this.mHit + 
            "  Num Destroy: " + this.mNumDestroy +
            "  Projectile: " + this.mProjectiles.size();
};

Hero.prototype._moveByKeys = function() {
    var xf = this.getXform();
    if (gEngine.Input.isKeyPressed(this.moveUp)&& xf.getYPos()< 120)
        xf.incYPosBy(this.kDelta);
    if (gEngine.Input.isKeyPressed(this.moveLeft)&& xf.getXPos()> 0)
        xf.incXPosBy(-this.kDelta);
    if (gEngine.Input.isKeyPressed(this.moveDown)&& xf.getYPos() > 0)
        xf.incYPosBy(-this.kDelta);
    if (gEngine.Input.isKeyPressed(this.moveRight) && xf.getXPos() < 100)
        xf.incXPosBy(this.kDelta);
};

Hero.prototype.decreaseHP = function(num){
    this.mHP = this.mHP - num;
};
