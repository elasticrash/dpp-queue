import * as http from 'http';
import * as url from 'url';
import { Incoming } from './incoming.model';
import { QueuePersistance } from './persist-queues';

let queues: string[] = new QueuePersistance().queueDefinition;

(async () => {
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