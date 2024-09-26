# codemasher/discord-timestamps

A generator for dynamic [Discord timestamps](https://discord.com/developers/docs/reference#message-formatting) because they're apparently incapable of doing this in-app.

[![License][license-badge]][license]
[![Build][gh-action-badge]][gh-action]

[license-badge]: https://img.shields.io/github/license/codemasher/discord-timestamps.svg
[license]: https://github.com/codemasher/discord-timestamps/blob/main/LICENSE
[gh-action-badge]: https://img.shields.io/github/actions/workflow/status/codemasher/discord-timestamps/build.yml?branch=main&logo=github&logoColor=ccc
[gh-action]: https://github.com/codemasher/discord-timestamps/actions/workflows/build.yml?query=branch%3Amain

## But why?

The currently available generators (google top results) don't allow for adjusting the time zone offset,
which is necessary for time zone math (e.g. when hoyoverse once again [posts an announcement with an obscure time zone](https://twitter.com/GenshinImpact/status/1838790652349264238)
such as *08:00 AM (UTC-4)* or *20:00 (UTC+8)*, and you want to share it with chat).

Another reason is portability: it's a single HTML file without any external dependencies that you can
[save on your computer](https://github.com/codemasher/discord-timestamps/blob/gh-pages/index.html).
