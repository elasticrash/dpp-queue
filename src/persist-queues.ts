import * as fs from 'fs';

export class QueuePersistance {
    private _queueDefinitions: string[] = [];
    private _queuePersistance: any[] = [];

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
                    this._queuePersistance.push(body.toString('utf8').split('\r\n'));
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
}