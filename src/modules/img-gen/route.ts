import { Router } from "express";
import { imgGenController, imgGetFrmRds } from "./controller";


const router = Router();


router.get("/generate-image", imgGenController);
router.get("/redis/image", imgGetFrmRds);

export {
    router as imgGenRoute
}