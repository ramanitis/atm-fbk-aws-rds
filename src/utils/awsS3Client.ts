import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function uploadBase64Public(base64String: string, imgName?: string) {

    const key = `public/${imgName ?? crypto.randomUUID()}.png`;

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            Body: Buffer.from(base64String, "base64"),
            ContentType: 'image/png',
            CacheControl: "public, max-age=31536000, immutable"
        })
    );

    const bucket = process.env.S3_BUCKET;
    const region = process.env.AWS_REGION;

    const url =
        region === "us-east-1"
            ? `https://${bucket}.s3.amazonaws.com/${key}`
            : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return { key, url };
}
