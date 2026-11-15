# 28 Days

A top-down pixel RPG about a first period and the month that follows.

**Play it:** https://swarapala.github.io/28-days/

You play Ruby. Pack your bag at home, go to health class at school, buy supplies at Corner Mart, and get through all four phases of the cycle. Leaks, cramps, cravings and mood swings included.

## Controls

| Key | What it does |
|---|---|
| Arrow keys / WASD | Walk |
| Space | Talk, use, confirm |
| B | Back / close a menu |
| I | Backpack |
| P | Phone: cycle tracker and Fact Book |
| H | Help |

You need a keyboard, so it doesn't work on phones yet.

## How it's built

Plain HTML, CSS and JavaScript on one canvas. No game engine, no build step and no image files: every tile, character and icon is pixel art drawn by code. Built with Claude Code, an AI coding assistant.

| File | What it does |
|---|---|
| `js/art.js` | Draws all the pixel art |
| `js/world.js` | Maps, items and characters |
| `js/engine.js` | Movement, the clock, the body simulation, menus, saving |
| `js/story.js` | Dialogue, facts, health lessons and quizzes |
| `js/demo.js` | A self-playing tour, at `?demo` |

`v1-cards/` is the first version of the game, before it was rebuilt as an RPG.

## Sources

Every health fact was checked against CDC, ACOG and NIH pages. See [SOURCES.md](SOURCES.md).

This game is not medical advice. Talk to a doctor or school nurse about your own body.
