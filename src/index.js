
import isPortReachable from 'is-port-reachable';

export const handler = async(event) => {
    let host = process.env.host;
    let port = process.env.port;
    let portresult = await isPortReachable(port, { host });
    console.log(`Host: ${host}`);
    console.log(`Port ${port}`);
    console.log(`${portresult? 'is' : 'is not'} reachable`);}
