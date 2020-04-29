import { DPFPDD_HW_MODALITY, DPFPDD_HW_TECHNOLOGY, DPFPDD_PRIORITY } from "../handlers/types/constant/constant.handler";

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

export interface DpfppdQueryDevicesStruct extends BaseResultStruct {
    devicesNumber: number;
    devicesList: ReaderStruct[];
};

export interface DpfppdQueryDevicesFunc {
    (): Promise<DpfppdQueryDevicesStruct>;
};

export interface DpfppdOpenStruct extends BaseResultStruct {
    readerName: string;
    readerHandle: any;
}

export interface DpfppdOpenFunc {
    (reader: ReaderStruct): Promise<DpfppdOpenStruct>;
}
export interface DpfppdOpenExtStruct extends BaseResultStruct {
    readerName: string;
    readerHandle: any;
    readerPriority: string;
}

export interface DpfppdOpenExtFunc {
    (reader: ReaderStruct, priority: typeof DPFPDD_PRIORITY.DPFPDD_PRIORITY_COOPERATIVE | typeof DPFPDD_PRIORITY.DPFPDD_PRIORITY_EXCLUSIVE): Promise<DpfppdOpenExtStruct>;
}

export interface DpfppdCloseStruct extends BaseResultStruct { }

export interface DpfppdCloseFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfppdCloseStruct>;
}

export interface DpfpddDevStatusStruct {
    size: number;
    status: string;
    fingerDetected: number;
    data: string;
}

export interface DpfppdGetDeviceStatusStruct extends BaseResultStruct {
    deviceStatus: DpfpddDevStatusStruct;
}

export interface DpfppdGetDeviceStatusFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfppdGetDeviceStatusStruct>;
}

export interface DpfpddDevCapsStruct {
    size: number,
    canCaptureImage: number,
    canStreamImage: number,
    canExtractFeatures: number,
    canMatch: number,
    canIdentify: number,
    hasFpStorage: number,
    indicatorType: number,
    hasPwrMgmt: number,
    hasCalibration: number,
    pivCompliant: number,
    resolutionCnt: number,
    resolutions: number[]
}

export interface DpfppdGetDeviceCapabilitiesStruct extends BaseResultStruct {
    deviceCaps: DpfpddDevCapsStruct;
}

export interface DpfppdGetDeviceCapabilitiesFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfppdGetDeviceCapabilitiesStruct>;
}
export interface UareUInterface {
    loadLibs: LoadLibsFunc;
    dpfpddVersion: DpfppdVersionFunc;
    dpfpddInit: DpfppdInitFunc;
    dpfpddExit: DpfppdExitFunc;
    dpfpddQueryDevices: DpfppdQueryDevicesFunc;
    dpfpddOpen: DpfppdOpenFunc;
    dpfpddOpenExt: DpfppdOpenExtFunc;
    dpfpddClose: DpfppdCloseFunc;
    dpfpddGetDeviceStatus: DpfppdGetDeviceStatusFunc;
    dpfpddGetDeviceCapabilities: DpfppdGetDeviceCapabilitiesFunc;
}