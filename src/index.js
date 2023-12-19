
import isPortReachable from 'is-port-reachable';
/* test event with hostname or ip address
{
    "host": "10.16.6.32",
    "port": "445"
}
*/

export const handler = async(event) => {
    let host = event.host;
    let port = event.port;
    let portresult = await isPortReachable(port, { host });
    console.log(`Host: ${host}`);
    console.log(`Port ${port}`);
    console.log(`${portresult? 'is' : 'is not'} reachable`);

    console.log(`Example environment variable: ${process.env.CONNECTSTRING}`);
}
