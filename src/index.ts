import * as http from 'http';
import * as url from 'url';
import { Incoming } from './incoming.interface';
import { QueuePersistence } from './persist-queues';

let queues: QueuePersistence = new QueuePersistence();

(async () => {
    const server = await http.createServer(endpoint);
    server.listen(3000);
})();

function endpoint(req: http.IncomingMessage, res: http.ServerResponse) {
    if (req.method === 'GET' && req.url) {
        const queryData = (url.parse(req.url, true).query) as unknown as Incoming;
        if (queryData.name && queryData.message) {
            queues.pushMessageToQueue(queryData.name, queryData.message);
            res.end('OK');
        } else if (queryData.name) {
            const message = queues.getMessageFromQueue(queryData.name);
            res.end(message);
        } else {
            res.end('query parameters are not correct');
        }
    }
}