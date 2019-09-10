---
layout: post
title:  "3D terrain from image"
date:   2015-02-11 09:48:00 +0200
categories: guides
---
Although it looks difficult, it's actually quite easy to generate a 3D model from a height map. This technique has been used for a long time, most notably in the landmark game [Myst](https://en.wikipedia.org/wiki/Myst).

![Screenshot from a surface in Blender](/media/posts/2015-02-11-3d-terrain-from-image/surface-blender.png)

# Blender

We'll use the free and open-source 3D application [Blender](https://www.blender.org/) to generate the 3D model.

The trick is to generate a plane with lots of points, then use the [displace modifier](https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/displace.html) to change the position of the points based on the brightness of each pixel.

 <video width="100%" controls>
    <source src="/media/posts/2015-02-11-3d-terrain-from-image/blender-displace-modifier.mp4" type="video/mp4" />
Your browser does not support the video tag. Try using <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a> or <a href="https://www.google.com/chrome/">Chrome</a>.
        </video>

# Resources

For more information, check out the following guides:

* [Blender manual](https://docs.blender.org/manual/en/latest/index.html)
* [Simple Terrain Meshes Using The Display Modifier](http://www.katsbits.com/tutorials/video/displace-terrain.php): another video that explains the steps.
