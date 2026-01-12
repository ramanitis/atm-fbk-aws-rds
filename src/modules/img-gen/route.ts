import { Router } from "express";
import { genImgFrmGpt, imgGetFrmRds, imgPutToAWS } from "./controller";

const router = Router();

router.get("/generate-image", genImgFrmGpt);
router.get("/redis/image", imgGetFrmRds);
router.post("/generate-url", imgPutToAWS);

export {
    router as imgGenRoute
}