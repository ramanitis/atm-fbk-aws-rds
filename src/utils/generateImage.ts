import axios from "axios";
import { redisCleint } from "./redisClient";

export const generateImage = async (prompt: string, redisKey?:string): Promise<string> => {

    try {
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

        const openaiUrl = "https://api.openai.com/v1/images/generations";
        const model = process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1.5";

        const res = await axios.post(
            openaiUrl,
            {
                model,
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                output_format: "png",
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                timeout: 120_000,
            }
        );
        
        const b64 = (res?.data as { data: { b64_json: string }[] })?.data?.[0]?.b64_json;
        if (!b64) throw new Error("OpenAI did not return b64_json image data");
        
        const ttlSeconds = 600;
        const key = redisKey ?? 'B64:JID:UID';
        await redisCleint.set(key, b64, { EX: ttlSeconds });

        return b64;
    } catch (error) {
        console.error("Error generating image:", error);
        return '';
    }

}