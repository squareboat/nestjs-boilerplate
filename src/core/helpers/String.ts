import { isEmpty } from './Helpers';

declare global {
    interface String {
        after(needle: string): string;
        before(needle: string): string;
        truncate(length: number): string;
    }
}

if (!String.prototype.before) {
    const func = function (needle: string): string {
        if (isEmpty(this)) return null;
        return this.split(needle)[0];
    };

    Object.defineProperty(String.prototype, 'before', {
        value: func,
        enumerable: false,
    });
}

if (!String.prototype.after) {
    const func = function (needle: string): string {
        if (isEmpty(this)) return null;
        return this.split(needle)[1];
    };

    Object.defineProperty(String.prototype, 'after', {
        value: func,
        enumerable: false,
    });
}

if (!String.prototype.truncate) {
    const func = function (len: number): string {
        return this.length > len ? this.substr(0, len - 1) + '...' : this;
    };

    Object.defineProperty(String.prototype, 'truncate', {
        value: func,
        enumerable: false,
    });
}
