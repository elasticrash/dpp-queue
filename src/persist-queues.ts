import * as fs from 'fs';
import * as stream from 'stream';
import { QueueStructure } from './queue-structure.interface';

export class QueuePersistence {
    private _queueDefinitions: string[] = [];
    private _queuePersistance: QueueStructure[] = [];

    constructor() {
        this.createQueueDefinitionArray();
        this.createQueuePersistance();
    }

    private getQueueByName(name: string): QueueStructure | undefined {
        let queue = this._queuePersistance.find(x => x.name === name);
        if (!queue) {
            const body = this.readFile(name);
            if (body) {
                queue = {
                    name: name,
                    messages: []
                }
                this._queuePersistance.push(queue);
                this.writeMessage('queues', name);
            }
        }
        return queue;
    }

    public pushMessageToQueue(name: string, message: string) {
        const queue = this.getQueueByName(name);
        if (queue) {
            this.writeMessage(name, message);
            queue.messages.push(message);
            console.log(queue.messages);
        }
    }

    public getMessageFromQueue(name: string) {
        const queue = this.getQueueByName(name);
        if (queue) {
            const message = queue.messages[0];
            const stat = fs.statSync(name);
            fs.truncateSync(name, stat.size - message.length - 2);
            const response = queue.messages.shift();
            console.log(`${response} was requested and removed`);
            return response;
        }
    }


    private createQueueDefinitionArray() {
        console.log('...loading queue definition');
        const body = this.readFile('queues');
        if (body) {
            this._queueDefinitions = body.toString('utf8').split('\r\n');
            console.log('...loading queue definition complete');
        } else {
            console.log('...loading queue definition failed');
            process.exit(2);
        }
    }

    private createQueuePersistance() {
        console.log('...loading queue persistance');
        if (this._queueDefinitions.length > 0) {
            this._queueDefinitions.forEach((def) => {
                const body = this.readFile(def);
                if (body) {
                    this._queuePersistance.push({
                        name: def,
                        messages: body.toString('utf8').split('\r\n').reverse()
                    });
                } else {
                    console.log('...loading queue persistance failed');
                    process.exit(2);
                }
            });
        }
        console.log('...loading queue persistance complete');
    }

    private readFile(filename: string): Buffer | undefined {
        if (!fs.existsSync(filename)) {
            fs.writeFile(filename, '', (error) => {
                if (error) {
                    console.log(error);
                }
            });
            return Buffer.from('');
        }

        try {
            return fs.readFileSync(filename);
        } catch (error) {
            console.log(error);
        }
    }

    private writeMessage(filename: string, message: string) {
        const fd = fs.openSync(filename, 'r+');
        const data = fs.readFileSync(filename);
        const buffer: Buffer = Buffer.from(`${message}\r\n`);
        fs.writeSync(fd, buffer, 0, buffer.length, 0);
        fs.writeSync(fd, data, 0, data.length, buffer.length);
        fs.closeSync(fd);
    }
}