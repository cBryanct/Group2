/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
var shieldcalculator = 0;
function ShieldSet(sprite) {
    GameObjectSet.call(this);
    this.kShieldSheet = sprite;
}
gEngine.Core.inheritPrototype(ShieldSet, GameObjectSet);

ShieldSet.prototype.update = function() {
    
    // remove the expired ones
    var i, obj;
//    for (i=0; i<this.size(); i++) {
//        obj = this.getObjectAt(i);
//        if(obj.mHP <= 0){
//            obj.setExpired();
//        }
//        if (obj.hasExpired())
//            this.removeFromSet(obj);
//    }
    
    // update all objects
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        obj.update();
    }
    
    //Create stone randomly
    shieldcalculator = shieldcalculator+1;
    if(shieldcalculator ===  1000){
        var d = new Shield(this.kShieldSheet, 100*Math.random(), 120);
        this.addToSet(d);
        shieldcalculator =  0;
    }
};
