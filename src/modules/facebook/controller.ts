import { Request, Response } from "express";
import { redisCleint } from "../../utils/redisClient";
import axios from "axios";
import { uploadBase64Public } from "../../utils/awsS3Client";

export const fbkAuthReq = async (req: Request, res: Response) => {

    const fbAuthUrl = new URL('https://www.facebook.com/v20.0/dialog/oauth');

    fbAuthUrl.searchParams.set('client_id', process.env.APP_ID!);
    fbAuthUrl.searchParams.set('redirect_uri', process.env.REDIRECT_URI!);
    fbAuthUrl.searchParams.set('state', 'TKN:RMN:FBK');
    fbAuthUrl.searchParams.set(
        'scope',
        'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts'
    );

    console.log(fbAuthUrl)
    res.redirect(fbAuthUrl.toString());

}

export const fbkAthCbk = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    console.log(req.query)
    const key = req.query.state as string;

    if (!code) {
        res.status(400).send("Missing ?code");
        return
    }

    try {
        const shortTokenResp: any = await axios.get(
            "https://graph.facebook.com/v20.0/oauth/access_token",
            {
                params: {
                    client_id: process.env.APP_ID,
                    redirect_uri: process.env.REDIRECT_URI,
                    client_secret: process.env.APP_SECRET,
                    code,
                },
            }
        );

        const shortLivedUserToken = shortTokenResp.data.access_token;

        const longTokenResp: any = await axios.get(
            "https://graph.facebook.com/v20.0/oauth/access_token",
            {
                params: {
                    grant_type: "fb_exchange_token",
                    client_id: process.env.APP_ID,
                    client_secret: process.env.APP_SECRET,
                    fb_exchange_token: shortLivedUserToken,
                },
            }
        );

        const longLivedUserToken = longTokenResp.data.access_token;

        await redisCleint.set(key, longLivedUserToken);

        res.json({
            success: true,
            short_lived_token: shortLivedUserToken,
            long_lived_token: longLivedUserToken,
            expires_in: longTokenResp.data.expires_in,
        });

    } catch (error: any) {
        console.error("Error exchanging token:", error?.response?.data || error);
        res.status(500).json({
            success: false,
            error: error?.response?.data || "Failed during token exchange",
        });
    }
}

export const fbkUsrPgs = async (req: Request, res: Response) => {
    const userToken = await redisCleint.get("TKN:RMN:FBK");
    console.log(userToken)
    if (!userToken) {
        return res.status(400).json({ error: "Missing ?token=<USER_ACCESS_TOKEN>" });
    }

    try {
        const response: any = await axios.get(
            "https://graph.facebook.com/v20.0/me/accounts",
            {
                params: {
                    access_token: userToken,
                    fields: "id,name,access_token,category,tasks"
                }
            }
        );

        const pages = response.data.data;

        await redisCleint.set("FBK:PGS:RMN", JSON.stringify(pages));

        res.json({
            success: true,
            pages: (pages as { id: string, name: string, access_token: string }[]).map(page => ({ id: page.id, name: page.name }))
        });

    } catch (error: any) {
        console.error("Error fetching pages:", error.response?.data || error);
        res.status(500).json({
            success: false,
            error: error.response?.data || "Failed to fetch pages",
        });
    }
}

export const fbkPgsPst = async (req: Request, res: Response) => {
    const { pageId, message } = req.body;

    const redisFBKpages = await redisCleint.get("FBK:PGS:RMN");
    const fbkPages: { id: string, name: string, access_token: string }[] = JSON.parse(redisFBKpages ?? '[]');
    const fbkPage = fbkPages.filter(page => page.id === pageId);
    const pageAccessToken = fbkPage[0].access_token;

    const b64 = await redisCleint.get("B64:JID:UID");
    if (b64 === null) {
        res.status(404).json({ error: "Not found (maybe expired)" });
        return
    }

    const uploadResponse = await uploadBase64Public(b64);

    if (!pageId || !pageAccessToken) {
        res.status(400).json({
            error: "Missing pageId or pageAccessToken"
        });
        return
    }

    if (!uploadResponse.url || !message) {
        res.status(400).json({
            error: "Missing imageUrl or pageAccessToken"
        });
        return
    }

    try {
        const result = await axios.post(
            `https://graph.facebook.com/v20.0/${pageId}/photos`,
            {},
            {
                params: {
                    url: uploadResponse.url,
                    caption: message,
                    access_token: pageAccessToken
                }
            }
        );

        return res.json({
            success: true,
            facebook_response: result?.data
        });

    } catch (error: any) {
        console.error("Post error:", error.response?.data || error);
        return res.status(500).json({
            success: false,
            error: error.response?.data || "Failed to create Page post"
        });
    }
}