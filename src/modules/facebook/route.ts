import { Router } from "express";
import { fbkAthCbk, fbkAuthReq, fbkPgsPst, fbkUsrPgs } from "./controller";

const router = Router();

router.get("/auth/facebook", fbkAuthReq);
router.get("/auth/facebook/callback", fbkAthCbk);
router.get("/facebook/page", fbkUsrPgs);
router.post("/facebook/post", fbkPgsPst);

export {
    router as fbkMmtRoute
}