import { DPERROR } from './error.interface';
import DPERROR_CONSTANTS from './error.constants';

export default class ErrorHandler {
    constructor(error: any, errorInfo?: Error) {
        if (typeof error === 'number') {
            if (DPERROR_CONSTANTS[error]) {
                const { brief }: DPERROR = DPERROR_CONSTANTS[error];
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
