export class ConnectionCosts {
    forward_dimension: number;
    backward_dimension: number;
    #buffer: Int16Array;
    constructor(forward_dimension: number, backward_dimension: number) {
        this.forward_dimension = forward_dimension;
        this.backward_dimension = backward_dimension;

        // leading 2 integers for forward_dimension, backward_dimension, respectively
        this.#buffer = new Int16Array(forward_dimension * backward_dimension + 2);
        this.#buffer[0] = forward_dimension;
        this.#buffer[1] = backward_dimension;
    }

    get buffer() {
        return this.#buffer;
    }

    put(forward_id: number, backward_id: number, cost: number) {
        const index = forward_id * this.backward_dimension + backward_id + 2;
        if (this.#buffer.length < index + 1) {
            throw "ConnectionCosts buffer overflow";
        }
        this.#buffer[index] = cost;
    }

    get(forward_id: number, backward_id: number) {
        const index = forward_id * this.backward_dimension + backward_id + 2;
        if (this.#buffer.length < index + 1) {
            throw "ConnectionCosts buffer overflow";
        }
        return this.#buffer[index];
    }

    loadConnectionCosts(connection_costs_buffer: Int16Array) {
        if (connection_costs_buffer.length < 2) {
            throw new Error(`Parse error of matrix.def: ${connection_costs_buffer}`);
        }
        this.forward_dimension = connection_costs_buffer[0]!;
        this.backward_dimension = connection_costs_buffer[1]!;
        this.#buffer = connection_costs_buffer;
    }
}
