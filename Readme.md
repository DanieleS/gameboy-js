# Gameboy JS

This is a JavaScript (TypeScript) implementation of a Gameboy Emulator.

![Pokemon Blue](./images/pokemon.jpg)

## Goal

Some time ago I wrote a [Gameboy emulator in Rust](https://github.com/DanieleS/rustyboy) for fun. In my day to day job I am a frontend developer and I asked myself if I could write the same emulator using only web technologies (without cheating with WebAssembly 😄).

This is not the most feature complete emulator out there, nor the most accurate, but it mostly works and with surprisingly good performance.

Some (most?) games will not run as expected (or will not run at all). If you try to run one of these games, please open an issue (or, even better, a PR), and I will try to take a look 😄.

## Run locally

To run the emuletor locally you must clone this repository first.

```bash
git clone https://github.com/DanieleS/gameboy-js
```

Then you have to install the NPM dependencies

```bash
npm install
```

Then you can run the dev server

```bash
npm run dev
```
