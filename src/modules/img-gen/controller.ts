import { Request, Response } from "express";
import { generateImage } from "../../utils/generateImage";
import { redisCleint } from "../../utils/redisClient";
import { uploadBase64Public } from "../../utils/awsS3Client";

export const genImgFrmGpt = async (req: Request, res: Response) => {
    const prompt = req.query.prompt as string;
    if (!prompt) {
        res.status(400).send("Prompt is required");
        return
    }

    try {
        const b64 = await generateImage(prompt);
        const imgBuffer = Buffer.from(b64, "base64");

        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-Length", String(imgBuffer.length));
        res.setHeader("X-Cache", "MISS");
        res.status(200).send(imgBuffer);
    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).send("Failed to generate image");
    }
}

export const imgGetFrmRds = async (req: Request, res: Response) => {
    try {
        const key = req.query?.key as string;
        if (!key) {
            res.status(402).send("Key Not Found");
            return;
        }
        if (!key.length) {
            res.status(403).send("Invalid Key");
            return;
        }
        const data = await redisCleint.get(key);
        if (data === null) {
            return res.status(404).json({ error: "Not found (maybe expired)" });
        }

        const ttl = await redisCleint.ttl(key);
        return res.json({ ttlSecondsRemaining: ttl, data });
    } catch (error) {
        console.error("Error getting image:", error);
        res.status(500).send("Failed to get image");
    }
}

export const imgPutToAWS = async (req: Request, res: Response) => {
    try {
        const key = req.query?.key as string;
        if (!key) {
            res.status(402).send("Key Not Found");
            return;
        }
        if (!key.length) {
            res.status(403).send("Invalid Key");
            return;
        }
        const data = await redisCleint.get(key);
        if (data === null) {
            return res.status(404).json({ error: "Not found (maybe expired)" });
        }

        const uploadResponse = await uploadBase64Public(data);
        res.status(200).json({ message: 'content uploaded successfully', ...uploadResponse })
    } catch (error) {
        console.error("Error Uploading image:", error);
        res.status(500).send("Failed to upload image");
    }
}