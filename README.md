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

<br/>
<br>

# 14-Spotify Playlist Downloader
A simple, stupid and difficult to use program for directly downloading full spotify playlists that I made for my dad, as I couldn't find similar software.


<br/>
<br>


# 15-Smallest Executable
I tried following the procedure of Inkbox to create a really small executable file. While mine is much bigger than what he managed to do, Its still quite little and can fit into a QR code! Just a note: most of the binary is literally blank zero areas, which occupy 80% of the space. There is a way ~kind of~ to get rid of some of them by writing a custom PE and using crinkler, but I failed on that part (-_-)

Also, this took an crazy long amount of time.


<img src="15-Smallest%20Executable/qrcode.png" alt='qr code' width="200">

<br/>
<br>



# 16-MC Bot
Stupid minecraft bot that has exactly 3 commands: "come" and it walks up to you, "collect X_BLOCK" and it neverendingly looks and collects that type of block, and "stop" (it's a mistery command). This is my shitty comeback to EW, been too busy attempting to build a processor.


<img src="16-MC%20Bot/mcbot.png" alt='mc bot' width="500">

That poor robot making a hole for me
<br/>
<br>
<br>





# 17-Smartass
I accidentally happened to make another unethical tool for students to bypass education (like HumanTyper). It's not even that I'm lazy. It's a stupid website my teacher uses, and it so happens to make us solve around 130 questions each week AFTER reading the whole material. That website is evil and has no consideration for students. To vent it out I just made a proof of concept tool that completely solves everything while the student does something healthy, like eat avocado. I just hope one day online classes won't suck because of some stupid programmers who don't give a shit about students. 


<img src="17-Smartass/icon.png" alt='avocado' width="300">
<br/>
the actual logo
<br>
<br>