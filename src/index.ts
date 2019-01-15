import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';

import { Incoming } from './incoming.model';

(async () => {
    
    if (!fs.existsSync('queues')) {
        fs.writeFile('queues', '', (error) => {
            if (error) {
                console.log(error);
            }
        });
    }

    const server = await http.createServer(endpoint);
    server.listen(3000);
})();

function endpoint(req: http.IncomingMessage, res: http.ServerResponse) {
    if (req.url) {
        const queryData = (url.parse(req.url, true).query) as unknown as Incoming;
        if (queryData.name && queryData.priority && queryData.message) {
            res.end('OK');
        } else {
            res.end('query parameters are not correct');
        }
    }

}