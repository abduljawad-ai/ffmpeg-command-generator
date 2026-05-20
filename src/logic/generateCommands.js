import { secondsToHMS } from './formatTime.js';
import { computeKeepSegments } from './computeKeepSegments.js';

/**
 * Derive the base name from a filename (strip extension).
 * "my_video.mp4" → "my_video"
 */
function baseName(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Generate all FFmpeg commands.
 * Returns { extractCmds, mergeListCmd, mergeCmd, cleanupCmd, bashScript, keepSegments }
 */
export function generateCommands(filename, videoDuration, zones) {
  const keeps = computeKeepSegments(zones, videoDuration);
  const base = baseName(filename);

  // Step A — extract keep segments
  const partNames = keeps.map((_, i) => `${base}_part${i + 1}.mp4`);

  const extractCmds = keeps.map((seg, i) => {
    const start = seg.start;
    const end = seg.end;
    const partFile = partNames[i];
    if (start === 0) {
      return `ffmpeg -i "${filename}" -to ${secondsToHMS(end)} -c copy "${partFile}"`;
    }
    return `ffmpeg -i "${filename}" -ss ${secondsToHMS(start)} -to ${secondsToHMS(end)} -c copy "${partFile}"`;
  });

  // Step B — create merge list
  const listLines = partNames.map((p) => `file '${p}'`).join('\\n');
  const mergeListCmd = `printf "${listLines}\\n" > mylist.txt`;

  // Step C — merge
  const mergeCmd = `ffmpeg -f concat -safe 0 -i mylist.txt -c copy "${base}_final.mp4"`;

  // Step D — cleanup
  const cleanupCmd = `rm ${partNames.map((p) => `"${p}"`).join(' ')} mylist.txt`;

  // Full bash script
  const bashScript = [
    '#!/bin/bash',
    '',
    '# Step 1: Extract keep segments',
    ...extractCmds,
    '',
    '# Step 2: Create merge list',
    mergeListCmd,
    '',
    '# Step 3: Merge all parts losslessly',
    mergeCmd,
    '',
    '# Step 4: Clean up temporary files',
    cleanupCmd,
  ].join('\n');

  return {
    keepSegments: keeps,
    extractCmds,
    mergeListCmd,
    mergeCmd,
    cleanupCmd,
    bashScript,
    partNames,
    outputFile: `${base}_final.mp4`,
  };
}
