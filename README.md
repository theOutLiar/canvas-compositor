# canvas-compositor
A canvas compositor that doesn't suck. 

###WIP

This is a Work In Progress.

If you have something helpful to say, please do - otherwise, keep your complaints to yourself. 

Proper documentation to come...

#Getting started

You should be able to include the compiled files from the dist directory in any HTML page, which will add the `CanvasCompositor` namespace to your global scope. I like to assign it to a shorthand `cc`. 

You can then start using the CanvasCompositor's scene and graphics APIs by instantiating it with a canvas: 

```
var _cc = new CanvasCompositor(document.getElementById('myCanvas'));
```

Our `_cc` variable will expose some basic drawing functions (e.g.: `drawPath`, `drawRectangle`, `drawEllipse`, etc.)as well as a variety of classes (e.g.: `Path`, `Rectangle`, `Ellipse`, etc.) that utilize them.

The `_cc` variable will also have `Scene` property. If your only drawing pixels to canvas, this property is unnecessary, but if you intend to have any kind of animated or layered interactions, this object will be incredibly important.

The `Scene` property is the entry point to your scene graph. It is of class `Container` (which is also exposed, and can be extended freely). `Container`s have `children` - the order of the `Scene`'s `children` determines the order in which they are drawn. 

`Container`s, like `Scene`, can have children added to them through the `addChild` method. The children can be `Container`s or any other inheritors of the `CanvasObject` class. 

`Container`s and `CanvasObject`s, in conjunction with `Rectangle`s, `Ellipse`s, etc., comprise an implementation of the [Composite Pattern](http://en.wikipedia.org/wiki/Composite_pattern).

#Tests

At the moment, there are none. I'll probably get to that later. 

If you have a problem with that, either get over it or look at the code and write the tests yourself. 
