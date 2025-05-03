# [![](https://raw.githubusercontent.com/Johnnycyan/cyan-chat/main/src/img/CyanChat40.webp)](#) Cyan Chat [![GitHub version](https://img.shields.io/badge/release-v2.3.4-blue)](#) [![Website chat.johnnycyan.com](https://img.shields.io/website?url=https%3A%2F%2Fchat.johnnycyan.com%2Findex.html)](https://chat.johnnycyan.com) [![GitHub license](https://img.shields.io/github/license/Johnnycyan/cyan-chat)](https://github.com/Johnnycyan/cyan-chat/blob/main/LICENSE)

**Cyan Chat** (A fork of JChat) is an overlay that allows you to show your Twitch chat (and optionally Youtube chat) on screen with OBS, XSplit, and any other streaming software that supports browser sources. It supports your [**BetterTTV**](https://betterttv.com/), [**FrankerFaceZ**](https://www.frankerfacez.com/) and [**7TV**](https://7tv.app/) emotes, always at the best available quality. You have many options to customize your chat, like enabling a smooth animation for new messages, or fading old ones after some time. If you have a chat full of !gamble addicts, you can choose to hide bots and commands messages. It also comes with many fonts and styling options that can be combined as desired.
### The app is up and running on the [website](https://chat.johnnycyan.com).

## Features
- 7TV, BTTV and FFZ emotes support
- Websocket for 7TV emotes for instant emote addition/deletion/renaming
- Custom channel badges
- Lots of fonts and styling options
- Twitter emojis
- 7TV Personal Emotes
- Colored mentions with Twitch color or 7TV Paint color
- 7TV, BTTV, FFZ, FFZ:AP and Chatterino user badges (on/off)
- 7TV Name Paints (on/off)
- Smooth animation (on/off)
- Fade old messages (on/off)
- Hide bots messages (on/off)
- Hide commands messages (on/off)
## Commands
- `!chat refresh` to force newly added emotes to appear if there was an issue (mods only)
- `!chat reload` to reload the chat source (mods only)
- `!chat rickroll` to rickroll the chat (mods only)
- `!chat tts` send a tts message with the chat (mods only) // Optionally use -v {voice} to specify a voice
- `!chat ytplay [YouTube URL] -d [duration] -s [start_time]` - Embeds a YouTube video (duration defaults to 5s, use 0 to play the whole video).
- `!chat ytstop` - Removes the currently playing YouTube embed.
- `!chat img [emote_name] or [link]` - Shows the emote image or url image.
- `!chat test [num]` - Sends a number of generated test messages into the chat widget. The number is optional and defaults to 5.

- **Force Flag** - On the **ytplay** and **img** commands if you specify **-f** it will show it over the chat instead of under.

<details>
<summary>Voice list</summary>

- Brian
- Ivy
- Justin
- Russell
- Nicole
- Emma
- Amy
- Joanna
- Salli
- Kimberly
- Kendra
- Joey
- Mizuki (Japanese)
- Chantal (French)
- Mathieu (French)
- Maxim (Russian)
- Hans (German)
- Raveena (Indian)

</details>

Thank you to [ixnoahlive](https://github.com/ixnoahlive) for creating a [Youtube Websocket](https://github.com/ixnoahlive/youtube-websocket) that I use for this project.
