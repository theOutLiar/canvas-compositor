define(['lodash', 'canvas-object'], function(_, CanvasObject){
    'use strict';
    function Container(){
        CanvasObject.call(this);
    }

    _.assign(Container.prototype, CanvasObject.prototype);

    return Container;
});