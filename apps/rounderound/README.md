# roundYround

roundYround is a simplified, focused UI for turn-by-turn directions provided by OsmAnd(~/+). 

# Setup

roundYround is entirely dependent on GadgetBridge Bangle.js to receive direction from OsmAnd. It has no pathfinding capabilities of its own.

In Gadgetbridge, go to the app-wide settings menu (left pane), then External Integrations, then Navigation apps. Make sure "sent navigation to watch" is on, and that the other settings (package name, the OsmAnd toggle) are set properly.

Connect your Bangle and your phone through Gadgetbridge. Open the roundYround app on your Bangle. Pick a destination in OsmAnd. Start navigation in OsmAnd, and roundYround should update with your directions as you start moving.

I recommend turning OFF "Send notifications to this phone" in GadgetBridge, and only using the "external integrations" option with OsmAnd. This avoids annoying "voice" notifications popping up and disrupting navigation.

Even without disabling this option, roundYround will likely (depending on your phone and watch settings) block all other notifications from reaching the watch while running.

# Usage

The main screen displays:

1) The street to continue on or turn onto
2) The next turn to be taken
3) The distance to the turn.

*The street name will update and tell you what street to turn to when you're a little under a mile from the next turn.* When you're further than that, it will indicate which street you're on (and should continue on).

The distance readout is in miles or kilometers depending on locale setting. The readout will turn yellow once you're less than half a mile (or kilometers) to the next move.

Short-pressing the button on the Bangle.js will display the full text of the last notification received by the device instead. Short-pressing the button again will switch back to the main screen.

That's it!

# Caveats & Known Issues
There is no clever reading of packets going on; the app is simply parsing the "instruction" string sent by OsmAnd via notification, and trying to read the street name from it. I've made an attempt to handle all the message formats I've seen, but there are some I'm bound to miss.

The "show instructions" screen can be useful in these cases.

Because the app works on brute string-bashing, it is quite likely at some point that OsmAnd will update the way they write notifications and break this app to a greater or lesser extent. 

Gadgetbridge acts as a middleman between OsmAnd and the watch, and it's also likely that it will update the way *it* handles navigation notifications, breaking this app to a greater or lesser extent.

This app has only been tested on OsmAnd~ (and Gadgetbridger Bangle.js 0.87.1-banglejs). It may or may not be able to handle Google Maps, Waze, or other turn-by-turn providers. It probably cannot.

Rarely, turn-by-turn directions will give a contradictory instruction - I have noticed occasions where the text says "turn right" but the arrow indicates a left turn (or vice versa). This seems to be an issue with OsmAnd, not this app.

# Future plans and ideas

	* Setup 'lexicon' files so that instructions from other apps (or future versions of OsmAnd/gadgetbridge) can be parsed properly without touching code.
	* Add a compass screen, displaying north (and maybe a waypoint), as in Waypointer Moto.