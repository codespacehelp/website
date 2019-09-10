---
layout: post
title:  Reading in a Reflectance Sensor with Arduino
date:   2014-10-09 09:48:00 +0200
categories: guides
---
### Requirements

*   **Arduino**: is an open-source physical computing platform based on a microcontroller and a development environment. The board can be bought at several shops, the environment can be downloaded [here.](http://arduino.cc/en/Main/Software) We recommend reading some of the [documentation](http://arduino.cc/en/Guide/HomePage) on their website.
    Arduino is developed for artists, students and enthousiast to make projects in- and outside the computer accessible: ![](/media/posts/2014-11-05-reading-reflectance-sensor/maud-arduino.png)
*   **Reflectance sensor**: available at several shops. We used [this one](http://www.pololu.com/product/959). It comes with a [library for Arduino](https://github.com/pololu/qtr-sensors-arduino) which can also be downloaded.
*   **Processing**: is an open-source programming platform which makes it easy to access the data from the sensor and then to use it as audio parameter. Processing comes with a few pre-installed libraries: we will use Serial and Minim. Processing can be downloaded [here](https://www.processing.org/download/). Information on the used libraries can be found [here](https://www.processing.org/reference/libraries/)
*   **Pure Data**: an alternative for Processing. Pure Data (or Pd) is an open-source real-time graphical programming environment for audio, video, and graphical processing. PD can be dowloaded [here](http://puredata.info/). PD is a modular environment where sketches are made by connecting nodes to each other. **Johannes Kreidler** wrote an excellent book ('Loadbang - Programming music in pure data') on music in PD covering all aspects of (electronic) music: audio, audio synthesis, wave shaping, sampling ..

[an online tutorial.](http://www.pd-tutorial.com/)

### The sensor

The Pololu QTR reflectance sensor carry infrared LED and phototransistor pairs that can **provide analog measurements of IR reflectance**, which makes them great for close-proximity edge detection and line-following applications. The modules come as compact, single-sensor units (QTR-1A) or as a bar of eight modules. We used the single sensor version.

In order to work with the library that comes with the module we need to download the [zip archive from GitHub](https://github.com/pololu/qtr-sensors-arduino), decompress it, and drag the “QTRSensors” folder to your arduino libraries directory.

You should now be able to use these libraries in your sketches by selecting **Sketch > Import Library > QTRSensors** from your Arduino IDE (or simply type '#include <qtrsensors.h>' at the top of your sketch). Note that you might need to restart your Arduino IDE before it sees the new libraries.</qtrsensors.h>

Once this is done, you can create a QTRSensorsAnalog object for your QTR-xA sensor.

### The setup

Next step is to connect the sensor to the Arduino board. At this moment there is no need for soldering (prototype) so we will use a breadboard which enables us to make connection without soldering them.

From the [specifics](http://www.pololu.com/product/959) we can see that the operating voltage is 5.0 V. Wiring goes like this:

*   VIn --> 5V
*   GND --> GND
*   OUT --> A0 (analog 0)

![](/media/posts/2014-11-05-reading-reflectance-sensor/wiring.png)

### Arduino code

The library comes with a few code examples for a bar of eight modules. Following code was derived from these and reads one sensor on port A0\. The library also contains calibration functions for finetuning further in the process.

```c
#include <QTRSensors.h>

QTRSensorsAnalog qtra((unsigned char[]) {0},1);
unsigned int sensorValues[1];

void setup()
{
    Serial.begin(9600);
    qtra.emittersOn();
}

void loop()
{
    qtra.read(sensorValues);
    Serial.write(sensorValues[0]);
    delay(50);
}
```

### Processing code

The Processing sketch uses two core libraries: Serial and Minim. Serial is the library which will be responsible for listing to the serial port / call for the sensor value. Minim is an audioprocessing library and we will use it to create a simple waveshape that can be manipulated over amplitude and frequency.

```c
import processing.serial.*; // import the serial and minim libs.
import ddf.minim.*;
import ddf.minim.ugens.*;

Minim       minim; // create variables for audio processing
AudioOutput out;
Oscil       wave;

Serial myPort; // create variables for serial communication
int val;

void setup()
{
    size(500, 500);
    //println(Serial.list()); // call for serial list to point to the right one.
    String portName = Serial.list()[4];
    myPort = new Serial(this, portName, 9600);

    minim = new Minim(this);
    out = minim.getLineOut();
    wave = new Oscil( 440, 0.5, Waves.QUARTERPULSE );
    wave.patch( out );
}

void draw()
{
    if ( myPort.available() > 0) {
    val = myPort.read();
    }
    background(val);
    // amplitude over a wave shape to make it go from loud to silence and back.
    wave.setAmplitude(sin((frameCount)/50.0));
    // frequenty will change by changing the sensor value.
    float freq = map( val, 0, 1023, 110, 660 );
    wave.setFrequency(freq);
}
```
