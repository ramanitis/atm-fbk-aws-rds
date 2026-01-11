import {Router} from 'express';
import { defaultRouteController } from './controller';

const router = Router();

router.get('/', defaultRouteController);

export {
    router as commonRouter
}