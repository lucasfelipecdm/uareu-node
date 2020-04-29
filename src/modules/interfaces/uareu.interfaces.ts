import { DPFPDD_HW_MODALITY, DPFPDD_HW_TECHNOLOGY } from "../handlers/types/constant/constant.handler";

export interface IdentifyResult {
    index: number | string;
};

export interface Fmd {
    size: number;
    fmdType: number,
    data: any;
};

export interface CompareResult {
    result: 'MATCH' | 'DONT MATCH';
    score: number;
};

export interface CaptureCallback {
    (context: any, reserved: number, callbackDataSize: number, callbackData: any): any;
};

export interface BaseResultStruct {
    callbackRet: number;
    readableRet: string;
}

export interface LoadLibsFunc {
    (dpfpddLibPath?: string, dpfjLibPath?: string): Promise<number>;
}

export interface DpfpddVerInfoStruct {
    major: number;
    minor: number;
    maintenance: number;
}

export interface DpfppdVersionStruct extends BaseResultStruct {
    size: number;
    lib_ver: DpfpddVerInfoStruct;
    api_ver: DpfpddVerInfoStruct;
}

export interface DpfppdVersionFunc {
    (): Promise<DpfppdVersionStruct>;
}

export interface DpfppdInitStruct extends BaseResultStruct { }

export interface DpfppdInitFunc {
    (): Promise<DpfppdInitStruct>;
}

export interface DpfppdExitStruct extends BaseResultStruct { }

export interface DpfppdExitFunc {
    (): Promise<DpfppdExitStruct>;
}

export interface DpfpddHwDescrStruct {
    vendorName: string;
    productName: string;
    serialNum: string;
}

export interface DpfpddHwIdStruct {
    vendorId: number;
    productId: number;
}

export interface DpfpddHwVersionStruct {
    hwVer: DpfpddVerInfoStruct;
    fwVer: DpfpddVerInfoStruct;
    bcdVer: number;
}

export interface ReaderStruct {
    size: number;
    name: string;
    dpfpddHwDescr: DpfpddHwDescrStruct;
    dpfpddHwId: DpfpddHwIdStruct;
    dpfpddHwVersion: DpfpddHwVersionStruct;
    modality: string;
    technology: string;
    data: any;
}

export interface QueryDevicesStruct extends BaseResultStruct {
    devicesNumber: number;
    devicesList: ReaderStruct[];
};

export interface QueryDevicesFunc {
    (): Promise<QueryDevicesStruct>;
};

export interface UareUInterface {
    loadLibs: LoadLibsFunc;
    dpfpddVersion: DpfppdVersionFunc;
    dpfpddInit: DpfppdInitFunc;
    dpfpddExit: DpfppdExitFunc;
    dpfpddQueryDevices: QueryDevicesFunc;
}