
import {handler} from './index.js';

let event = {};

handler(event).then(() => {
    console.log('done');
}).catch((err) => {
    console.error(err);
});