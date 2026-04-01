---
layout: subpage
tags: guide
title: Raspberry Pi Video Looper
subtitle: Digital signage
description: Turn a Raspberry Pi into a dedicated video looper for installations and digital signage.
date: 2026-04-01
categories: guides
---

Sometimes you just need a screen to loop a video — at an exhibition, in a hallway, or as part of an installation. You don't want a full computer for that; a Raspberry Pi does the job perfectly. [Video Looper](https://videolooper.de/) is a free, open-source disk image that turns a Pi into a dedicated video player. You flash it onto an SD card, plug in a USB stick with your videos, and it loops them endlessly. No desktop, no menus, no fuss.

One important thing to know: Video Looper works with Raspberry Pi models up to the Pi 4. It does **not** work on the Raspberry Pi 5.

Imane Benyecif made a video walkthrough of the entire setup process:

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/9UG17x2-VkY" frameborder="0" allowfullscreen></iframe>
</div>

## What You Need

- A Raspberry Pi (any model from Pi 1 B+ through Pi 4, or Pi Zero WH)
- A microSD card (4 GB minimum)
- A USB stick formatted as FAT32, ExFAT, or NTFS
- A power supply (2.5A for Pi 3, 3A for Pi 4)
- An HDMI cable and a display
- Your video files in MP4 format

## How It Works

Head over to [videolooper.de](https://videolooper.de/) and download the latest image file. Flash it to your microSD card using [Raspberry Pi Imager](https://www.raspberrypi.com/software/) or [Balena Etcher](https://etcher.balena.io/) — both handle the compressed image directly, no need to unzip first.

Insert the SD card into your Pi, connect it to a display via HDMI, and plug in the power. The Pi boots straight into looper mode. Now put your MP4 files on a USB stick, plug it in, and playback starts automatically. That's it.

## Preparing Your Videos

Video Looper uses the H.264 codec for playback, so your files need to be MP4 containers with H.264 video at a maximum resolution of 1080p. 4K is not supported.

If your videos are in a different format, [Handbrake](https://handbrake.fr/) is a good free tool for converting them. Just select the "Fast 1080p30" preset and export as MP4.

## Going Further

If you want to tweak the behaviour, you can access the Pi over SSH (default credentials: `pi` / `video`) and edit the configuration file at `/boot/video_looper.ini`. From there you can enable random playback order, load M3U playlists, or set up GPIO buttons for physical controls.

The full documentation is available on [videolooper.de](https://videolooper.de/).
