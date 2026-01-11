import { Router } from "express";
import { imgGenController, imgGetFrmRds, imgPutToAWS } from "./controller";

const router = Router();

router.get("/generate-image", imgGenController);
router.get("/redis/image", imgGetFrmRds);
router.post("/generate-url", imgPutToAWS);

export {
    router as imgGenRoute
}