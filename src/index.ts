import express from 'express';
import "dotenv/config";
import { commonRouter } from './modules/common/route';
import { imgGenRoute } from './modules/img-gen/route';
import { connectRedis } from './utils/redisClient';
import { fbkMmtRoute } from './modules/facebook/route';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(commonRouter);
app.use(imgGenRoute);
app.use(fbkMmtRoute);



async function main() {
    try {
        await connectRedis();
    } catch (error) {
        console.error(error);
        console.log("Failed to connect Redis");
    }
    
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

main();