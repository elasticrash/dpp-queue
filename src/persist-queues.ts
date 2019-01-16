import * as fs from 'fs';
import { QueueStructure } from './queue-structure.interface';

export class QueuePersistance {
    private _queueDefinitions: string[] = [];
    private _queuePersistance: QueueStructure[] = [];

    constructor() {
        this.createQueueDefinitionArray();
        this.createQueuePersistance();
    }

    public set queueDefinition(queues: string[]) {
        this._queueDefinitions = queues;
    }

    public get queueDefinition() {
        return this._queueDefinitions;
    }

    public getQueueByName(name: string): QueueStructure | undefined {
        return this._queuePersistance.find(x => x.name === name);
    }

    public pushMessageToQueue(name: string, message: string) {
        const queue = this.getQueueByName(name);
        if (queue) {
            this.writeMessage(name, message);
            queue.messages.push(message);
        }
    }

    private createQueueDefinitionArray() {
        console.log('...loading queue definition');
        const body = this.readFile('queues');
        if (body) {
            this.queueDefinition = body.toString('utf8').split('\r\n');
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
                        messages: body.toString('utf8').split('\r\n'),
                        timestamp: Date.now()
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
        fs.appendFileSync(filename, `${message}\r\n`);
    }
}