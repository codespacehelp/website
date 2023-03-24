---
layout: post
tags: post
title: Decoding Matterport 3D Scenes
date: 2023-03-24
categories: guides
---
Recently I came across a [virtual tour of the National Gallery](https://www.nationalgallery.org.uk/visiting/virtual-tours/sainsbury-wing-vr-tour). This virtual gallery is a great tour of the space in 3D, showing all the paintings in the space.

The tour was made with [Matterport](https://matterport.com/), a 3D capturing solution with special cameras that can quickly and accurately scan a room.

![Screenshot of Matterport](/static/posts/2023-03-24-matterport-protocol/matterport-screenshot.jpg)

We wanted to have the measurements of this room and wondered if we would be able to get the file in a program like Blender; turns out, yes, we can:

<video src="https://codespacehelp.s3.amazonaws.com/_site/matterport-protocol/museum-blender.mp4" controls muted autoplay loop></video>

I wanted to document the journey to show the steps I took to get there.

## The Web Inspector

The first step in getting any kind of data is opening the web inspector. Specifically, when loading the 3D scene, I want to have the Network tab open to see all the requests coming in. It helps here to filter down on "XHR" requests, basically requests that don't come from the initial load of the page but are triggered by JavaScript, such as the Matterport player.


<video src="https://codespacehelp.s3.amazonaws.com/_site/matterport-protocol/matterport-requests.mp4" muted autoplay loop></video>


Immediately we can see all the traffic streaming in: a *lot* of JPEG files, and at the very top, some files in an unknown format. 

Specifically, we see that one file is a 1,19MB file with the type `application/octet-stream`. Interesting! This might be our 3D model, although we don't know that yet. 

Before that, we actually have a number of JSON files, with an endpoint of `graph`, that also contain interesting data. They seem to kick off the loading of the files. One of them contains the following snippet:

![Screenshot of Matterport](/static/posts/2023-03-24-matterport-protocol/network-view.jpg)

It seems to refer to a mesh file ending with the `.dam` extension, further confirming our hunch that this is the 3D model. Let's take a deeper look in the file!

## The DAM File

Opening this file in Hex Fiend clearly shows that this is a binary file. The `file` command in the Terminal also doesn't give more information. So we're a bit stuck here. 

![Screenshot of Matterport](/static/posts/2023-03-24-matterport-protocol/hex-fiend.png)


Searching for "DAM format Matterport" finds this [Gist](https://gist.github.com/foone/4bd3d9ca059d59e070d1e2aed7ddfe36):

![Screenshot of Matterport](/static/posts/2023-03-24-matterport-protocol/proto-file.png)


That seems like a Protocol Buffers format. Nice! Protocol Buffers is a file format developed by Google for efficiently encoding structured data. As we can see from the screenshot, we have data for vertices, faces and materials, which looks very promising.

We don't really understand what the "quantized" bit means, but we'll see if we get something out of it first.

## Parsing the DAM File with protobuf.js

https://github.com/protobufjs/protobuf.js/

While I was writing this blog post, GPT-4 just came out. I gave it the .proto file and ask it to parse the file with Node.js and protobuf.js.

The results where almost okay, but it required some more complex parsing. However, I found some Python code that did the trick:

https://github.com/willowpsychology/rogue_matterport_archiver

So then I asked GPT-4 to convert that code to JavaScript, which worked like a charm! The only thing I had to do was rotate the model in the X-axis by -90 degrees, which was easy to fix. 

## The Result

Once we decoded the protobuf file, we could convert it to an OBJ file and a MTL file referencing all the materials. We could then import the model in Blender, and even export it back out to a GLB file, ready to view on the web:

<video src="https://codespacehelp.s3.amazonaws.com/_site/matterport-protocol/museum-glb-1.mp4" controls muted autoplay loop></video>

You see that the quality is considerably worse than the original; this is the "base" layer in Matterport, captured from a 3D scan of the museum. This layer you see while moving around from spot to spot. Matterport files additionally contain 360° photos of each fixed spots, giving a high-quality view of that exact spot.

<video src="https://codespacehelp.s3.amazonaws.com/_site/matterport-protocol/museum-glb-2.mp4" controls muted autoplay loop></video>

Overall this was a fun project, and I'm happy to have found a way to decode the files. The techniques extend beyond just grabbing 3D models from Matterport, and can be used to decode any custom viewer that uses Protocol Buffers.

Source code for the parser is available on [GitHub](https://github.com/codespacehelp/matterport-decoder).