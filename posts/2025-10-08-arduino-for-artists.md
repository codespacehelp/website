---
layout: post
tags: post
title: Arduino for Artists
date: 2025-10-08
categories: guides
---

Arduino is a fantastic platform for artists to build interactive installations, sculptures, and other physical computing projects. Its relatively cheap hardware, user-friendly interface, and large community makes it easy to get started with electronics and programming.

This post will be a mini-workshop helping artists get started with Arduino. If you're new to Arduino, I recommend checking out the [official Arduino website](https://www.arduino.cc/) for tutorials and resources.

## What is physical computing?

Physical computing bridges the digital and physical worlds. Think of it as teaching a computer to sense and respond to the real world through sensors (input) and actuators (output). The Arduino is essentially a translator—it converts physical phenomena (light, sound, touch) into electrical signals the processor understands, then translates digital decisions back into physical actions (movement, light, sound).

### The Role of the Arduino

Unlike a computer running many programs simultaneously, the Arduino runs one dedicated program, in a loop, continuously. This single-purpose focus makes it reliable for installations that need to run for hours, days, or months. Think of it like a DJ who constantly monitors the crowd (sensors) and adjusts the music (outputs) in real-time.

### The signal-action loop

Every physical computing project follows this pattern: sense → process → respond → repeat. The device uses sensors to gather data from the environment, processes that data according to the programmed logic, and then triggers outputs based on that logic. It does this in a loop, running dozens of times per second, creating a continuous interaction.

## Hardware Kit

We've put together a simple hardware kit to get you started. It includes:

- An Arduino board (e.g., Arduino Uno R4)
- A small breadboard for prototyping circuits
- Jumper wires
- A push button
- A light sensor (LDR)
- A piezo buzzer

![Arduino Hardware Kit](/static/posts/2025-10-08-arduino-for-artists/arduino-hardware-kit.jpg)

## Getting Started with Arduino

In this demo we're using the [Arduino Uno R4](https://store.arduino.cc/products/uno-r4-wifi) but any Arduino board will do. Download the [Arduino IDE](https://www.arduino.cc/en/software) and install it on your computer. The IDE is where you'll write and upload your code to the Arduino board. Use a USB-C cable to connect the board to your computer.

If you're working with the UNO R4 WiFi, make sure to install the necessary boards in the Arduino software. In the sidebar, click the "boards" icon (second icon from the top), search for "UNO R4" and click "Install".

![Arduino Board setup](/static/posts/2025-10-08-arduino-for-artists/arduino-board-setup.png)

### Example 1: Blinking an LED

**Conceptual principle**: Digital outputs have only two states: HIGH (5V) or LOW (0V). This binary nature is the foundation of all digital electronics.

```cpp
void setup() {
  pinMode(13, OUTPUT);  // Configure pin 13 as output
}

void loop() {
  digitalWrite(13, HIGH);  // Turn LED on
  delay(1000);             // Wait 1 second
  digitalWrite(13, LOW);   // Turn LED off
  delay(1000);             // Wait 1 second
}
```

Copy this code in the Arduino IDE, then hit the upload button (right arrow icon). The builtin LED should start blinking on and off every second.

**Key insight**: The setup code runs once when the Arduino is powered on or reset, configuring pin 13 as an output. The loop code runs repeatedly, turning the LED on and off with a one-second delay in between. The blinking pattern emerges from the repetition of the on/off/delay loop structure.

![Example 1: Blink](/static/posts/2025-10-08-arduino-for-artists/example-01-blink.jpg)

### Example 2: Button-Controlled Tone

**Conceptual principle**: The tone() function generates a [square wave](<https://en.wikipedia.org/wiki/Square_wave_(waveform)>) at a specific frequency. Sound is vibration: faster vibrations create higher pitches. The piezo speaker converts electrical oscillation into physical membrane movement.

We'll use the breadboard for this. The breadboard has internal wires that connect the columns of the breadboard together. You can see this on the back of the breadboard:

![Back of the breadboard](/static/posts/2025-10-08-arduino-for-artists/breadboard-back.jpg)

Plug the piezzo buzzer and the button into the breadboard, like so:

![Breadboard components setup](/static/posts/2025-10-08-arduino-for-artists/example-02-breadboard-components.jpg)

Then connect wires:

- From pin GND on the Arduino to the `-` pin of the piezzo buzzer.
- From pin 5V on the Arduino to the middle leg of the buzzer.
- From pin 8 on the Arduino to the `S` pin of the piezzo buzzer.
- From pin GND on the Arduino to one leg of the button.
- From pin 2 on the Arduino (Digital 2) to the other leg of the button.

Connect the piezo speaker's positive leg (longer leg) to pin 8 on the Arduino, and the negative leg (shorter leg) to GND. Connect one leg of the button to pin 2 on the Arduino, and the other leg to GND.

![Breadboard components setup](/static/posts/2025-10-08-arduino-for-artists/example-02-breadboard-wires.jpg)

Use the following code:

```cpp
const int buttonPin = 2;x§zz§
const int speakerPin = 8;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);  // Internal resistor pulls pin HIGH
  pinMode(speakerPin, OUTPUT);
}

void loop() {
  if (digitalRead(buttonPin) == LOW) {  // Button pressed (connects to ground)
    tone(speakerPin, 440);  // Play A4 note (440 Hz)
  } else {
    noTone(speakerPin);     // Silence
  }
}
```

**Key insight**: The button uses an internal pull-up resistor, so when not pressed, the pin reads HIGH. Pressing the button connects it to GND, making it read LOW. The tone() function generates a square wave at 440 Hz (the pitch of A4) when the button is pressed, and noTone() stops the sound when released. The interaction emerges from the continuous checking of the button state in the loop.
