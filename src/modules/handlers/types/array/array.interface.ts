export interface CharArray {
    (length: number): any;
};

export interface UCharArray {
    (length: number): any;
};

export interface IntArray {
    (length: number): any;
};

export interface UIntArray {
    (length: number): any;
};

export interface GenericArrayFrom {
    (type: any, length: number): Buffer;
};