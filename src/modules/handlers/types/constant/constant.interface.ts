import * as ref from 'ref-napi';

export interface ConstantInterface {
    [index: string]: number | string | ref.Type;
}

export interface KeyByValue {
    (object: object, value: any): string | undefined;
}