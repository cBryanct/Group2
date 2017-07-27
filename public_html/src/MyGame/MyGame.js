/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,Projectile,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
var shield = null;
function MyGame() {
    this.kStoneSprite = "assets/stone_sprite.png";
    this.kHero1Sprite = "assets/hero1_sprite.png";
    this.kHero2Sprite = "assets/hero2_sprite.png";
    this.kHeroBoundPoint = "assets/particle.png";
    this.kProjectileTexture = "assets/particle.png";
    this.kShieldSprite = "assets/shield.png";
    this.kBackgroundTexture = "assets/Background.jpg";
    this.kStatus = "Status: ";

    // The camera to view the scene
    this.mCamera = null;
    this.mHero_1 = null;
    this.mHero1Bound = null;
    this.mHero_2 = null;
    this.mHero2Bound = null;
    this.mPath_1 = null;
    this.mPath_2 = null;
    this.mStoneSet = null;
    this.mBackground = null;
    // Projectile.js has already been read in ...
    Projectile.kTexture = this.kProjectileTexture;
}
gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    gEngine.Textures.loadTexture(this.kStoneSprite);
    gEngine.Textures.loadTexture(this.kHero1Sprite);
    gEngine.Textures.loadTexture(this.kHero2Sprite);
    gEngine.Textures.loadTexture(this.kProjectileTexture);
    
    gEngine.Textures.loadTexture(this.kShieldSprite);
    gEngine.Textures.loadTexture(this.kBackgroundTexture);
};

MyGame.prototype.unloadScene = function () {    
    gEngine.Textures.unloadTexture(this.kStoneSprite);
    gEngine.Textures.unloadTexture(this.kHero1Sprite);
    gEngine.Textures.unloadTexture(this.kHero2Sprite);
    gEngine.Textures.unloadTexture(this.kProjectileTexture);
    
    gEngine.Textures.unloadTexture(this.kShieldSprite);
    gEngine.Textures.unloadTexture(this.kBackgroundTexture);
    gEngine.Core.startScene(new MyGame());
};

MyGame.prototype.initialize = function () {
    // Step A: set up the cameras

    this.mCamera = new Camera(
        vec2.fromValues(50, 60),  // position of the camera
        100,                      // width of camera
        [240, 0, 600, 720],        // viewport (orgX, orgY, width, height)
        2
    );
    this.mCamera.setBackgroundColor([0, 0.8, 0.8, 1]);
            // sets the background to gray
            
     gEngine.DefaultResources.setGlobalAmbientIntensity(3.6);
    
//    this.mMsg = new FontRenderable(this.kStatus);
//    this.mMsg.setColor([0, 0, 0, 1]);
//    this.mMsg.getXform().setPosition(2, 2);
//    this.mMsg.setTextHeight(3);
    
    this.mBackground = new TextureRenderable(this.kBackgroundTexture);
    this.mBackground.setColor([1,1,1,0]);
    this.mBackground.getXform().setPosition(50,60);
    this.mBackground.getXform().setSize(100,120);
    
    shield = this.kShieldSprite;
    this.mPath_1 = new LineSet();
    this.mHero_1 = new Hero(this.kHero1Sprite, this.mPath_1, 10, 50);
    this.mHero1Bound = new HeroBound(this.kHeroBoundPoint, 10, 50);
    this.mHero_1.setMoveKeys(
            gEngine.Input.keys.W,
            gEngine.Input.keys.A,
            gEngine.Input.keys.S,
            gEngine.Input.keys.D
        );//hero1的按键信息及属性
    this.mHero_1.setSpeed(0.6);
    this.mHero_1.setPower(1.3);
    this.mHero_1.setShotKey(gEngine.Input.keys.Space);    
    
    this.mPath_2 = new LineSet();
    this.mHero_2 = new Hero(this.kHero2Sprite, this.mPath_2, 90, 50);
    this.mHero2Bound = new HeroBound(this.kHeroBoundPoint, 90, 50);
    this.mHero_2.setMoveKeys(
            gEngine.Input.keys.I,
            gEngine.Input.keys.J,
            gEngine.Input.keys.K,
            gEngine.Input.keys.L
        );//hero1的按键信息及属性
    this.mHero_2.setSpeed(0.8);
    this.mHero_2.setPower(1);
    this.mHero_2.setShotKey(gEngine.Input.keys.P);
    this.mStoneSet = new StoneSet(this.kStoneSprite);
    var d = new Stone(this.kStoneSprite, 50, 100);
    this.mStoneSet.addToSet(d);
    
    this.mShieldSet = new ShieldSet(this.kShieldSprite);
//    var s = new Shield(this.kShieldSprite, 50, 100);
//    this.mShieldSet.addToSet(s);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
MyGame.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.mBackground.draw(this.mCamera);
//    this.mMsg.draw(this.mCamera);
    this.mHero_1.draw(this.mCamera);
    this.mHero1Bound.draw(this.mCamera);
    this.mHero_2.draw(this.mCamera);  
    this.mHero2Bound.draw(this.mCamera);
    this.mPath_1.draw(this.mCamera);
    this.mPath_2.draw(this.mCamera);
    this.mStoneSet.draw(this.mCamera);
    this.mShieldSet.draw(this.mCamera);

        
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
MyGame.prototype.update = function () {
    this.mCamera.update();  // to ensure proper interpolated movement effects
    
    this.mPath_1.update(this.mCamera);
    this.mPath_2.update(this.mCamera);

    this.mHero_1.update(this.mHero_2, this.mStoneSet, this.mCamera);
    this.mHero_2.update(this.mHero_1, this.mStoneSet, this.mCamera);
    
    this.mHero_1.updateWithShield(this.mShieldSet);
    this.mHero_2.updateWithShield(this.mShieldSet);
    
    this.mHero1Bound.update(this.mHero_1, this.mStoneSet);
    this.mHero2Bound.update(this.mHero_2, this.mStoneSet);
    this.mStoneSet.update(this.mHero_1, this.mHero_2);
    this.mShieldSet.update();
//    this.mMsg.setText(this.mHero.getStatus());
};
