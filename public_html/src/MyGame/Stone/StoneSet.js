/* File: DyePack.js 
 *
 * Creates and initializes a simple DyePack
 */

/*jslint node: true, vars: true */
/*global gEngine, GameObjectSet */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
var calculator = 0;
function StoneSet(sprite) {
    GameObjectSet.call(this);
    this.kStoneSheet = sprite;
}
gEngine.Core.inheritPrototype(StoneSet, GameObjectSet);

StoneSet.prototype.update = function(hero) {
    
    // remove the expired ones
    var i, obj;
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        if(obj.mHP <= 0){
            obj.setExpired();
        }
        if (obj.hasExpired())
            this.removeFromSet(obj);
    }
    
    // update all objects
    for (i=0; i<this.size(); i++) {
        obj = this.getObjectAt(i);
        obj.update(hero);
    }
    
    //Create stone randomly
    calculator = calculator+1;
    if(calculator ===  50){
        var d = new Stone(this.kStoneSheet, 100*Math.random(), 120);
        this.addToSet(d);
        calculator =  0;
    }
    
    
    
};
