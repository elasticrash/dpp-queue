export class Incoming {
    public name: string;
    public priority: number;
    public message: string;

    constructor(parameters: Incoming) {
        this.name = parameters.name;
        this.priority = parameters.priority;
        this.message = parameters.message;
    }
}