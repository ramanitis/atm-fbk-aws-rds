import express from 'express';
import "dotenv/config";
import { commonRouter } from './modules/common/route';
import { imgGenRoute } from './modules/img-gen/route';
import { connectRedis } from './utils/redisClient';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(commonRouter);
app.use(imgGenRoute)



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