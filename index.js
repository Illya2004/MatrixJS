/**
 * @file Matrix.js
 * @description
 *   The `Matrix` class represents a 2D matrix-like data structure with custom logic
 *   for setting and retrieving values using a chainable method pattern. Internally,
 *   it uses a `Map` to store values based on X and Y coordinates.
 *
 *   Example usage:
 *     const matrix = new Matrix(5, 5);
 *     matrix.set()(2)(3)("Hello");
 *     const value = matrix.get()(2)(3); // "Hello"
 *
 * @class Matrix
 * @constructor
 * @param {number} x - Maximum allowed X size
 * @param {number} y - Maximum allowed Y size
 *
 * @private methods:
 *   - #finalCheck(obj): Validates that the object is not null or undefined.
 *   - #maxSizeLimit(x, y): Ensures coordinates stay within matrix boundaries.
 *   - #downtime(): Checks if the matrix is in a post-operation "cooldown" state.
 *
 * @public methods:
 *   - set(): Begins a set operation; returns a function to input the X coordinate.
 *   - get(): Begins a get operation; returns a function to input the X coordinate.
 *   - byX(x): Takes X coordinate and returns a function for Y.
 *   - byY(y): Takes Y coordinate and either sets or retrieves value.
 *   - value(val): Assigns value to current X/Y coordinates (only after `set()`).
 *   - getCurrentX(), getCurrentY(), getPreviousX(), getPreviousY():
 *       Accessors returning cloned coordinate state using lodash.
 *
 * @note
 *   - After any set/get operation, the matrix enters a "DOWNTIME" state.
 *     You must call set()/get() again to start a new operation.
 *   - Throws errors if coordinates exceed matrix boundaries.
 */
import _ from 'lodash';

export default class Matrix {
    constructor(x, y) {
        this.sizeX = x;
        this.sizeY = y;

        this.currentX = 0;
        this.currentY = 0;

        this.previousX = 0
        this.previousY = 0;

        this.status = NaN;

        this.map = new Map();
    }

    getCurrentX() {
        return _.clone(this.currentX);
    }

    getCurrentY() {
        return _.clone(this.currentY);
    }

    getPreviousX() {
        return _.clone(this.previousX);
    }

    getPreviousY() {
        return _.clone(this.previousY);
    }

    #finalCheck(obj) {
        if (obj === undefined || obj == null) {
            throw new Error(obj.name + "is null or undefined");
        }

        return this;
    }

    set() {
        this.status = "SET";
        return this.byX.bind(this);
    }

    get() {
        this.status = "GET";
        return this.byX.bind(this);
    }

    value(value) {
        if (this.#downtime()) {
            return null;
        }

        let toString = this.currentX.toString() + this.currentY.toString();
        this.map.set(toString, value);

        this.status = "DOWNTIME";
    }

    byY(y) {

        this.#finalCheck(this.currentY).#finalCheck(this.currentX);
        this.#maxSizeLimit(undefined, y);

        this.previousY = this.currentY;

        this.currentY = y;

        if (this.status == "GET") {
            this.status = "DOWNTIME";

            return this.map.get(this.currentX.toString() + this.currentY.toString());
        } else if (this.status == "SET") {
            return (value) => this.value(value);
        }


    }

    #downtime() {
        return this.status == "DOWNTIME" ? true : false;

    }

    #maxSizeLimit(x, y) {
        if (x !== undefined) {
            if (x >= this.sizeX) throw new Error("X out of bounds");
            return true;
        }

        if (y !== undefined) {
            if (y >= this.sizeY) throw new Error("Y out of bounds");
            return true;
        }
    }

    byX(x) {
        this.#maxSizeLimit(x, undefined);
        this.previousX = this.currentX;
        this.currentX = x;

        return x != null ? this.byY.bind(this) : this.#downtime() ? null : false;
    }


}