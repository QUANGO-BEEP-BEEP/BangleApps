# RoundYRound

RoundYRound is a simplified, focused UI for turn-by-turn directions provided by OsmAnd(~/+). 

# Usage

RoundYRound is entirely dependent on GadgetBridge Bangle.js to receive direction from OsmAnd. It has no pathfinding capabilities of its own.

I recommend turning OFF "Send notifications to this phone" in GadgetBridge, and only using the "external integrations" option with OsmAnd. This avoids annoying "voice" notifications popping up and disrupting navigation.

RoundYRound will likely (depending on your phone and watch settings) block all other notifications from reaching the watch while running.

# UI

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

This app has only been tested on OsmAnd~. It may or may not be able to handle Google Maps, Waze, or other turn-by-turn providers. It probably cannot.

Rarely, turn-by-turn directions will give a contradictory instruction - I have noticed occasions where the text says "turn right" but the arrow indicates a left turn (or vice versa). This seems to be an issue with OsmAnd, not this app.