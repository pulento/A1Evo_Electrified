# A1 Evo Electrified

A1 Evo Electrified is an Electron port of the excelent work from OCA named A1Evo, a web application to greatly improve Auddysey calibration using REW.

Please visit [OCA's YouTube video](https://www.youtube.com/watch?v=lmZ5yV1-wMI) that introduce A1 Evo

**Please note that output files are saved on A1Evo folder inside your home directory.**  

**Usually C:\Users\myuser\A1Evo on Windows or /User/myuser/A1Evo on MacOS**

# Features vs original A1Evo

<ul>
  <li>Standalone application for MacOS and Windows</li>
  <li>Automatic import of measurements to REW</li>
  <li>No more multiple downloads permission</li>
  <li>REW autostart with API enable</li>
  <li>Logs saved on A1Evo folder</li>
  <li>Target EQ Curve selection and automatic import on REW</li>
  <li>Settings panel to store default parameters like EQ curve, etc</li>
</ul>

# Install

Go to the [releases](https://github.com/pulento/A1Evo_Electrified/releases) and download last one for your architecture

**Windows Users: Please note the Setup.exe is the installer, it will install the application on your Apps folder and set a desktop and menu shortcut.
On next runs use the shorcuts installed, no need to run the installer again since it can reset some settings.**

# Install for Developers

Clone this repository:
```
git clone https://github.com/pulento/A1Evo_Electrified.git
```
```
cd A1Evo_Electrified
```
Install dependencies:

```
npm install
```

Run:

```
npm run start
```

Please note that you need REW 5.40 Beta 43 and upwards since automatic impulse response measurements is fixed since Beta 43.

Currently this app is being developed and tested on MacOS. Windows version seems to work but need more testing.

# Official A1 Evo forum thread

A1 Evo is discussed and released in the following [AVS Forum thread](https://www.avsforum.com/threads/audyssey-one-oca-does-it-again-and-again.3297198).

# Notes

This is work in progress provided as is. Also is a port of OCA's work please don't post bug reports regarding this port on OCA's channel or AVS Forum thread.

**MacOS packages aren't signed, MacOS probably will say it is damaged and should be deleted. Run the following from your terminal:**

```
xattr -c /Applications/A1Evo_Electrified.app
```
**Windows binaries aren't signed either but it will warn you and gives you the option to continue the first time you run**

