import dotenv from 'dotenv';
dotenv.config();
import {handler} from './index.js';

handler({}).then(() => {
    console.log('done');
}).catch((err) => {
    console.error(err);
});

