const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { getStorage } = require("firebase-admin/storage");
const logger = require("firebase-functions/logger");
const path = require("path");
const os = require("os");
const fs = require("fs");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

exports.compressAudio = onObjectFinalized({ cpu: 2, memory: "1GiB" }, async (event) => {
  const fileBucket = event.data.bucket;
  const filePath = event.data.name;
  const contentType = event.data.contentType;

  // Exit if not an MP3 or if we already processed it
  if (!contentType.startsWith("audio/mpeg") || filePath.includes("tmp_")) return null;

  const fileName = path.basename(filePath);
  const tempFilePath = path.join(os.tmpdir(), `tmp_${fileName}`);
  const tempOutputPath = path.join(os.tmpdir(), `output_${fileName}`);
  const bucket = getStorage().bucket(fileBucket);

  try {
    // Download original
    await bucket.file(filePath).download({ destination: tempFilePath });

    // Convert to 128kbps
    await new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .audioBitrate(128)
        .toFormat("mp3")
        .on("end", resolve)
        .on("error", reject)
        .save(tempOutputPath);
    });

    // Upload back with "isCompressed" flag in metadata
    await bucket.upload(tempOutputPath, {
      destination: filePath,
      metadata: { 
        contentType: "audio/mpeg",
        customMetadata: { isCompressed: "true" } 
      },
    });

    // Cleanup temp files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(tempOutputPath);
  } catch (error) {
    logger.error("Compression failed", error);
  }
});