import { DPERROR } from './error.interface';
import DPERROR_CONSTANTS from './error.constants';

export default class ErrorHandler {
    constructor(error: any, errorInfo?: Error) {
        if (errorInfo) {
            console.log(errorInfo);
        }
        if (typeof error === 'number') {
            const code = error.toString(16).slice(-3);
            if (DPERROR_CONSTANTS[code]) {
                const { brief }: DPERROR = DPERROR_CONSTANTS[code];
                throw new Error(brief);
            } else {
                throw new Error('Unknown code error.');
            }
        } else if (typeof error === 'string') {
            throw new Error(error);
        } else {
            throw new Error('Unknown error.');
        }
    }
};
