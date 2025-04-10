# EVERY WEEK

This a group of cool projects I did (almost) every week to learn new technologies




Here's information on some of the projects

<br>
<br>
<br>

# 8-ASCII Camera
This takes in the information from the camera (using ```cv2```) and transforms it into ASCII art, realtime. (check out [this repo where I improved the cam and added some features](https://github.com/korrectional/ASCII-Camera))
### To run: ```python main.py```
### Used libraries: ```cv2, os```
<img src="8-ASCII%20Camera/Pic.png" alt="Me" width="200">

<br/>
<br>

# 9-Door Movement Alarm
Little script for arduino device that plays a little alarm/ringtone each time someone opens/closes the door. This one was fun

<img src="9-Door%20Movement%20Alarm/scheme.jpg" alt='"scheme"' width="300">
<img src="9-Door%20Movement%20Alarm/in-action.jpg" alt='how its placed' width="300">

<br/>
<br>

# 10-Operating System Kernel
Small kernel. 2 years ago I tried to do that and I failed, this is my comeback. This one only prints 'The KERNEL has arrived' into video memory. I plan to continue this project in its own repo

<img src="10-Operating%20System%20Kernel/kernel.png" alt='that is all' width="300">

<br/>
<br>

# 11-Local Cloud
A couple small shell scripts I wrote as a local substitute to git while working on the week 10 project. While this was in the same week as the previous, I felt that I haven't had EW projects for so much time that I needed to drop 2 at once. The way it works is from a device you can either override the project version in the server or get the server version of the project. This allows to seamelessly work in a project in the same network with different devices. Nothing special really. Don't forget to create a .env file to store the password and adress of the server device.

<img src="11-Local%20Cloud/server.jpg" alt='had this guy laying around so he became my server' width="200">

<br/>
<br>

# 12-Web Scrapper
Simple python scripts that enters a website, scraps all the text (in my case, to feed a neural network) and looks for all the URLs and visits those tho, eventually going though all the public URLs in the website and taking all the juicy training material

<br/>
<br>

# 13-Language Model
A little language model that I created as a proof of concept (to myself). To run, you first need to run the scrapper (which extracts a bunch of text from wikipedia) and depending on how long you run it, you'll get a more complex model. Then train it with ```train.py``` and run with with ```run.py [first word] [second word] [number of words to generate]```. Note that that combination of two words has to exist inside your database (scrap.txt) in order for it to work. Don't worry though: when I had scrap.txt at ~25mb (and model at ~80mb) it could easily find most combinations of general words, stuff like "located in", "please do", "agreed to" and "wanted to". Have fun!

<img src="13-Language%20Model/wikai.png" alt='example' width="500">