export class Incoming {
    public name: string;
    public message: string;

    constructor(parameters: Incoming) {
        this.name = parameters.name;
        this.message = parameters.message;
    }
}