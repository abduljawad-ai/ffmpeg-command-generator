# FFmpeg Cut & Merge - Command Generator

A visual tool to generate FFmpeg commands for cutting and merging videos. Enter your video details, mark sections to delete, and get copy-paste ready terminal commands instantly.

## Features

- Visual timeline editor for marking deletion zones
- Real-time validation of time ranges
- Generates both cut commands and merge commands
- Shows keep segments with precise timestamps
- Quality presets reference (CRF values for different codecs)

## Usage

1. Enter your video filename and duration
2. Add deletion zones (start/end times)
3. Visualize the timeline
4. Click "Generate Commands" to get your FFmpeg commands
5. Copy and run in your terminal

## Tech Stack

- React 19
- Vite
- CSS (custom styling)

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```