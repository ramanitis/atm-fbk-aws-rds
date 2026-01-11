import { Request, Response } from "express";
import fs from 'fs';


export const controller = async (req: Request, res: Response) => {
    try {
        const data = fs.readFileSync("readme.md", "utf8");

        res.setHeader("Content-Type", "text/markdown; charset=utf-8");
        return res.status(200).send(data);
    } catch (error) {
        console.error("Error reading readme.md:", error);
        return res.status(500).send("Something Went Wrong!");
    }
};

export {
    controller as defaultRouteController
}