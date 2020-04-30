import { DPFPDD_PRIORITY_TYPE } from './../handlers/types/constant/constant.handler';
import { DPFPDD_IMAGE_FMT_TYPE, DPFPDD_IMAGE_PROC_TYPE } from "../handlers/types/constant/constant.handler";

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

export interface BaseResultStruct {
    callbackRet: number;
    readableRet: string;
};

export interface LoadLibsFunc {
    (dpfpddLibPath?: string, dpfjLibPath?: string): Promise<number>;
};

export interface DpfpddVerInfoStruct {
    major: number;
    minor: number;
    maintenance: number;
};

export interface DpfppdVersionStruct extends BaseResultStruct {
    size: number;
    lib_ver: DpfpddVerInfoStruct;
    api_ver: DpfpddVerInfoStruct;
};

export interface DpfppdVersionFunc {
    (): Promise<DpfppdVersionStruct>;
};

export interface DpfppdInitStruct extends BaseResultStruct { };

export interface DpfppdInitFunc {
    (): Promise<DpfppdInitStruct>;
};

export interface DpfppdExitStruct extends BaseResultStruct { };

export interface DpfppdExitFunc {
    (): Promise<DpfppdExitStruct>;
};

export interface DpfpddHwDescrStruct {
    vendorName: string;
    productName: string;
    serialNum: string;
};

export interface DpfpddHwIdStruct {
    vendorId: number;
    productId: number;
};

export interface DpfpddHwVersionStruct {
    hwVer: DpfpddVerInfoStruct;
    fwVer: DpfpddVerInfoStruct;
    bcdVer: number;
};

export interface ReaderStruct {
    size: number;
    name: string;
    dpfpddHwDescr: DpfpddHwDescrStruct;
    dpfpddHwId: DpfpddHwIdStruct;
    dpfpddHwVersion: DpfpddHwVersionStruct;
    modality: string;
    technology: string;
    data: any;
};

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
};

export interface DpfppdOpenFunc {
    (reader: ReaderStruct): Promise<DpfppdOpenStruct>;
};

export interface DpfppdOpenExtStruct extends BaseResultStruct {
    readerName: string;
    readerHandle: any;
    readerPriority: string;
};

export interface DpfppdOpenExtFunc {
    (
        reader: ReaderStruct,
        priority: DPFPDD_PRIORITY_TYPE
    ): Promise<DpfppdOpenExtStruct>;
};

export interface DpfppdCloseStruct extends BaseResultStruct { };

export interface DpfppdCloseFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfppdCloseStruct>;
};

export interface DpfpddDevStatusStruct {
    size: number;
    status: string;
    fingerDetected: number;
    data: string;
};

export interface DpfppdGetDeviceStatusStruct extends BaseResultStruct {
    deviceStatus: DpfpddDevStatusStruct;
};

export interface DpfppdGetDeviceStatusFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfppdGetDeviceStatusStruct>;
};

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
};

export interface DpfppdGetDeviceCapabilitiesStruct extends BaseResultStruct {
    deviceCaps: DpfpddDevCapsStruct;
};

export interface DpfppdGetDeviceCapabilitiesFunc {
    (reader: DpfppdOpenStruct | DpfppdOpenExtStruct): Promise<DpfppdGetDeviceCapabilitiesStruct>;
};

export interface DpfpddCaptureParamStruct {
    size: number;
    imageFmt: string;
    imageProc: string;
    imageRes: number;
};

export interface DpfpddImageInfoStruct {
    size: number;
    width: number;
    height: number;
    res: number;
    bpp: number;
};

export interface DpfpddCaptureResultStruct {
    size: number;
    success: number;
    quality: string;
    score: number;
    info: DpfpddImageInfoStruct;
};

export interface DpfpddCaptureStruct extends BaseResultStruct {
    captureParam: DpfpddCaptureParamStruct;
    captureResult: DpfpddCaptureResultStruct;
};

export interface DpfpddCaptureFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        imageFmt: DPFPDD_IMAGE_FMT_TYPE,
        imageProc: DPFPDD_IMAGE_PROC_TYPE,
        timeout: number
    ): Promise<DpfpddCaptureStruct>;
};

export interface DpfpddCaptureCallbackData0 {
    size: number;
    error: number;
    captureParm: DpfpddCaptureParamStruct;
    captureResult: DpfpddCaptureResultStruct;
    imageSize: number;
    imageData: Buffer;
    data: any;
}

export interface DpfpddCaptureCallbackFunc {
    (imageData: DpfpddCaptureCallbackData0, imageDataSize: number): void;
};

export interface DpfpddCaptureAsyncStruct extends BaseResultStruct {
    captureParam: DpfpddCaptureParamStruct;
};

export interface DpfpddCaptureAsyncFunc {
    (
        reader: DpfppdOpenStruct | DpfppdOpenExtStruct,
        imageFmt: DPFPDD_IMAGE_FMT_TYPE,
        imageProc: DPFPDD_IMAGE_PROC_TYPE,
        callback: DpfpddCaptureCallbackFunc
    ): Promise<DpfpddCaptureAsyncStruct>;
};

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
    dpfpddCapture: DpfpddCaptureFunc;
    dpfpddCaptureAsync: DpfpddCaptureAsyncFunc;
};