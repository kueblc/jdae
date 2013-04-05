JavaScript Dynamic Audio Engine
===============================
an HTML5 beat sequencer in under 10 kb

Originally created as a final project for ARTS 4965 Creative Collaborations with Professor Pauline Oliveros in fall of 2011. User interacts with an LED-like matrix to schedule a sequence of tonal beats that is played as the meter bar passes over. The user's web browser creates WAV files on the fly and plays them via HTML5 <audio>. Additional parameters of the sound generated can be adjusted via keyboard shortcuts detailed on the page. Source code for this version was over written but a production version is posted at http://kueblc.myrpi.org/jdae where it is packed into a mere 8.6 kb including all resources.

Revision 2 added a wave field effect to the LED board. Interacting with the board will propagate waves. This is purely aesthetic.

Revision 3 will bring multiuser collaboration and will be presented as a final project in ARTS 4962 Experimental Telepresence with Professor Pauline Oliveros in spring of 2013.

TODO
====
[x]Move existing code to github
[x]Write brief README
[ ]Add license and clean up headers
[ ]Refactor LEDBoard for greater cohesion
[ ]Make color scheme and styles configurable
[ ]Board state serializer
[ ]Refactor Sound for greater cohesion
[ ]Create Instrument class
[ ]Interface for creating instruments
[ ]Instrument serializer
[ ]Import PaperSink
[ ]Implement protocol to communicate app state
