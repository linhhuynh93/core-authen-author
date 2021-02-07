export const AWS = {
  S3: {
    EXPIRES_IN_SECOND: 600,
    MIN_SIZE: 10,
    MAX_SIZE: 209715200, // 200mb
    ACL: {
      PRIVATE: "private",
      PUBLIC_READ: "public-read",
      PUBLIC_READ_WRITE: "public-read-write",
      AWS_EXEC_READ: "aws-exec-read",
      AUTHENTICATED_READ: "authenticated-read",
      BUCKET_OWNER_READ: "bucket-owner-read",
      BUCKET_OWNER_READ_FULL_CONTROL: "bucket-owner-full-control",
      LOG_DELIVERY_WRITE: "log-delivery-write",
    },
    VIDEO_ORIGIN_PREFIX: "videos/origin/",
    VIDEO_CONVERTED_PREFIX: "videos/converted/",
    THUMBNAIL_SUFFIXZ: "0000000.jpg",
    FORMAT_MANIFEST: "mpd",
    VIDEO_CONVERT_SIFFIXZ: "video",
    AUDIO_CONVERT_SIFFIXZ: "audio",
    VIDEO_FORMAT: "mp4",
  },
};
