import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: process.env.AWS_S3_REGION!,
});

const bucket = process.env.AWS_S3_BUCKET!;

const main = async () => {
  const folder = process.argv[2];

  if (folder == null) {
    console.log(
      "Please provide a folder to optimize images in (e.g. `yarn resize-stay-images <folder>/`)",
    );
    process.exit(1);
  }

  const result = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: folder,
    }),
  );

  const fileKeys =
    result.Contents?.map((c) => c.Key!).filter((k) => k.endsWith(".jpg")) ?? [];

  if (fileKeys.length === 0) {
    console.log("No images found in folder.");
    process.exit(1);
  }

  console.log(`Resizing ${fileKeys.length} images.`);

  await new Promise((resolve) => setTimeout(resolve, 2500));

  let beforeBytes = 0;
  let afterBytes = 0;

  for (let i = 0; i < fileKeys.length; i++) {
    const key = fileKeys[i];
    const prefix = `[${i + 1}/${fileKeys.length}]`;

    const data = await s3Client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );

    const body = data.Body;

    if (body == null) {
      console.log(`${prefix} No body found for ${key}, skipping.`);
      continue;
    }

    const originalImageBuffer = Buffer.from(await body.transformToByteArray());

    const newImageBuffer = await sharp(originalImageBuffer, {
      failOn: "error",
    })
      .resize({
        withoutEnlargement: true,
        fit: "inside",
        width: 1200,
        height: 1200,
      })
      .rotate()
      .toBuffer();

    beforeBytes += originalImageBuffer.length;
    afterBytes += newImageBuffer.length;

    if (
      Math.round(originalImageBuffer.length / 1000) ===
      Math.round(newImageBuffer.length / 1000)
    ) {
      console.log(
        `${prefix} Skipping ${key} because it would save less than 1KB.`,
      );
      continue;
    }

    await s3Client.send(
      new PutObjectCommand({
        Body: newImageBuffer,
        Bucket: bucket,
        Key: key,
      }),
    );

    console.log(
      `${prefix} Resized image ${key} from ${Math.round(
        originalImageBuffer.length / 1024,
      )}KB to ${Math.round(newImageBuffer.length / 1024)}KB.`,
    );
  }

  console.log(
    `Resized ${fileKeys.length} images from a total of ${Math.round(
      beforeBytes / 1024,
    )}KB to ${Math.round(afterBytes / 1024)}KB (saving ${Math.round(
      (beforeBytes - afterBytes) / 1024,
    )}KB aka ${Math.round((beforeBytes - afterBytes) / 1024 / 1024)}MB aka ${
      100 - Math.round((afterBytes / beforeBytes) * 1000) / 10
    }%).`,
  );
};

main();
