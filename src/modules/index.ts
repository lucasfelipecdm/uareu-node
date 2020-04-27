import DllHandler from "./handlers/dll/dll.handler";
import ErrorHandler from "./handlers/error/error.handler";
import * as ref from 'ref-napi';
import * as ffi from 'ffi-napi';
import { dpfpdd_version, dpfpdd_dev_info, dpfpdd_dev_status, dpfpdd_dev_caps, dpfpdd_capture_param, dpfpdd_capture_result, dpfj_version, dpfpdd_capture_callback_data_0, dpfj_candidate } from "./handlers/types/struct/struct.handler";
import { genericArrayFrom } from "./handlers/types/array/array.handler";
import { DPFPDD_DEV, DPFPDD_PRIORITY, DPFPDD_IMAGE_FMT, DPFPDD_IMAGE_PROC, DPFPDD_LED_ID, DPFJ_ENGINE_TYPE, DPFJ_FMD_FORMAT, MAX_FMD_SIZE, DPFJ_PROBABILITY_ONE } from "./handlers/types/constant/constant.handler";
import QueryDevices from "./interfaces/query-devices.interface";
import CaptureCallback from "./interfaces/capture-callback.interface";
import Fmd from "./interfaces/fmd";
import CompareResult from "./interfaces/compare-result.interface";
import IdentifyResult from "./interfaces/identify-result.interface";

export default class UareU {
    private static instance: UareU;
    private static dpfpdd: any;
    private static dpfj: any;

    private constructor() { };

    public static getInstance = (): UareU => {
        if (!UareU.instance) UareU.instance = new UareU();
        return UareU.instance;
    };

    public loadLibs = (dpfpddLibPath?: string, dpfjLibPath?: string) => new Promise(async (resolve, reject) => {
        try {
            UareU.dpfpdd = await DllHandler.loadDpfppdFrom(dpfpddLibPath);
            UareU.dpfj = await DllHandler.loadDpfjFrom(dpfjLibPath);
            resolve('SUCCESS');
        } catch (e) {
            reject(e);
        }
    });

    public dpfpddVersion = () => new Promise<any>((resolve, reject) => {
        const ver = ref.alloc(dpfpdd_version);
        const res = UareU.dpfpdd.dpfpdd_version(ver);
        if (res === 0) {
            resolve(ver);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddInit = () => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_init();
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddExit = () => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_exit();
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddQueryDevices = () => new Promise<QueryDevices>((resolve, reject) => {
        // Max number of readers to return;
        const MAX_DEVICE_NUMBER = 5;

        // Get size to each buffer info to slice the arraybuffer
        const devInfo = new dpfpdd_dev_info;
        const devInfoSize = devInfo.ref().buffer.byteLength;
        const dev_infos = genericArrayFrom(dpfpdd_dev_info, MAX_DEVICE_NUMBER);

        // Set device count to max device number
        const devCnt = Buffer.alloc(ref.types.uint.size, MAX_DEVICE_NUMBER);

        const res = UareU.dpfpdd.dpfpdd_query_devices(devCnt, dev_infos);
        if (res === 0) {
            const deviceList: QueryDevices = {
                devicesNumber: devCnt.readInt8(),
                devicesList: [],
            }
            for (let i: number = 1; i <= devCnt.readInt8(); i++) {
                const device = new dpfpdd_dev_info(ref.reinterpret(dev_infos, devInfoSize, ((i - 1) * devInfoSize)));
                deviceList.devicesList.push(device);
            }
            resolve(deviceList);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddOpen = (readerInfo: typeof dpfpdd_dev_info) => new Promise<any>((resolve, reject) => {
        const name = readerInfo.name.buffer;
        const reader = ref.alloc(DPFPDD_DEV.type);
        const res = UareU.dpfpdd.dpfpdd_open(name, reader);
        if (res === 0) {
            resolve(ref.deref(reader));
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddOpenExt = (readerInfo: typeof dpfpdd_dev_info, priority: typeof DPFPDD_PRIORITY.DPFPDD_PRIORITY_COOPERATIVE | typeof DPFPDD_PRIORITY.DPFPDD_PRIORITY_EXCLUSIVE) => new Promise<Buffer>((resolve, reject) => {
        const name = readerInfo.name.buffer;
        const reader = ref.alloc(DPFPDD_DEV.type);
        const res = UareU.dpfpdd.dpfpdd_open_ext(name, priority, reader);
        if (res === 0) {
            resolve(ref.deref(reader));
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddClose = (reader: any) => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_close(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetDeviceStatus = (reader: any) => new Promise<any>((resolve, reject) => {
        const devStatus = ref.alloc(dpfpdd_dev_status);
        const res = UareU.dpfpdd.dpfpdd_get_device_status(reader, devStatus);
        if (res === 0) {
            resolve(devStatus);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetDeviceCapabilities = (reader: any) => new Promise<any>((resolve, reject) => {
        const devCaps = ref.alloc(dpfpdd_dev_caps);
        const res = UareU.dpfpdd.dpfpdd_get_device_capabilities(reader, devCaps);
        if (res === 0) {
            resolve(devCaps);
        } else {
            //get required size for the capabilities structure
            const errorCode = res.toString(16).slice(-3);
            if (errorCode === '00d') {
                const res = UareU.dpfpdd.dpfpdd_get_device_capabilities(reader, devCaps);
                if (res === 0) {
                    resolve(devCaps);
                } else {
                    reject(new ErrorHandler(res));
                }
            } else {
                reject(new ErrorHandler(res));
            }
        }
    });

    public dpfpddCapture = (
        reader: any,
        imageFmt: typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ISOIEC19794 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_PIXEL_BUFFER,
        imageProc: typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED_2 | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_PIV | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_UNPROCESSED,
        timeout: number = 5000,
    ) => new Promise<any>((resolve, reject) => {
        this.dpfpddGetDeviceCapabilities(reader).then((readerCaps) => {
            const IMAGE_DATA_SIZE = 2048;
            const captureResult = new dpfpdd_capture_result;
            const captureParam = new dpfpdd_capture_param;
            const imgSize = ref.alloc(ref.types.uint, IMAGE_DATA_SIZE);
            const imgData = Buffer.alloc(IMAGE_DATA_SIZE);
            captureParam.size = captureParam.ref().buffer.byteLength;
            captureParam.image_fmt = imageFmt;
            captureParam.image_proc = imageProc;
            captureParam.image_res = ref.deref(readerCaps).resolutions[0];
            const res = UareU.dpfpdd.dpfpdd_capture(reader, captureParam.ref(), timeout, captureResult.ref(), imgSize, imgData);
            if (res === 0) {
                resolve(res);
            } else {
                reject(new ErrorHandler(res));
            }
        }).catch((err) => {
            reject(err);
        })
    });

    public dpfpddCaptureAsync = (
        reader: any,
        imageFmt: typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ISOIEC19794 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_PIXEL_BUFFER,
        imageProc: typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED_2 | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_PIV | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_UNPROCESSED,
        callback: CaptureCallback
    ) => new Promise<any>((resolve, reject) => {
        this.dpfpddGetDeviceCapabilities(reader).then((readerCaps) => {
            const context = ref.alloc('void *');
            const captureParam = new dpfpdd_capture_param;
            captureParam.size = captureParam.ref().buffer.byteLength;
            captureParam.image_fmt = imageFmt;
            captureParam.image_proc = imageProc;
            captureParam.image_res = ref.deref(readerCaps).resolutions[0];
            const CaptureCallback = ffi.Callback('void', ['pointer', 'int', 'int', 'pointer'], callback);
            const res = UareU.dpfpdd.dpfpdd_capture_async(reader, captureParam.ref(), context, CaptureCallback);
            if (res === 0) {
                resolve(res);
            } else {
                reject(new ErrorHandler(res));
            }
        }).catch((err) => {
            reject(err);
        })
    });

    public dpfpddCancel = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_cancel(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddStartStream = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_start_stream(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddStopStream = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_stop_stream(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetStreamImage = (
        reader: any,
        imageFmt: typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ANSI381 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_ISOIEC19794 | typeof DPFPDD_IMAGE_FMT.DPFPDD_IMG_FMT_PIXEL_BUFFER,
        imageProc: typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_DEFAULT | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_ENHANCED_2 | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_PIV | typeof DPFPDD_IMAGE_PROC.DPFPDD_IMG_PROC_UNPROCESSED
    ) => new Promise<any>((resolve, reject) => {
        this.dpfpddGetDeviceCapabilities(reader).then((readerCaps) => {
            const IMAGE_DATA_SIZE = 2048;
            const captureResult = new dpfpdd_capture_result;
            const captureParam = new dpfpdd_capture_param;
            const imgSize = ref.alloc(ref.types.uint, IMAGE_DATA_SIZE);
            const imgData = Buffer.alloc(IMAGE_DATA_SIZE);
            captureParam.size = captureParam.ref().buffer.byteLength;
            captureParam.image_fmt = imageFmt;
            captureParam.image_proc = imageProc;
            captureParam.image_res = ref.deref(readerCaps).resolutions[0];
            const res = UareU.dpfpdd.dpfpdd_get_stream_image(reader, captureParam.ref(), captureResult.ref(), imgSize, imgData);
            if (res === 0) {
                resolve(res);
            } else {
                reject(new ErrorHandler(res));
            }
        }).catch((err) => {
            reject(err);
        })
    });

    public dpfpddReset = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_reset(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddCalibrate = (reader: any) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_calibrate(reader);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddLedConfig = (reader: any, ledId: number, ledMode: number) => new Promise<any>((resolve, reject) => {
        const reserved = ref.alloc('void *');
        const res = UareU.dpfpdd.dpfpdd_led_config(reader, ledId, ledMode, reserved);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddLedCtrl = (reader: any, ledId: number, ledCmd: number) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_led_ctrl(reader, ledId, ledCmd);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddSetParameter = (reader: any, parmId: number, buffer: Buffer) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_set_parameter(reader, parmId, buffer.length, buffer);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfpddGetParameter = (reader: any, parmId: number, buffer: Buffer) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfpdd.dpfpdd_get_parameter(reader, parmId, buffer.length, buffer);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjVersion = () => new Promise<any>((resolve, reject) => {
        const ver = ref.alloc(dpfj_version);
        const res = UareU.dpfj.dpfj_version(ver);
        if (res === 0) {
            resolve(ver);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjSelectEngine = (reader: any, engine: typeof DPFJ_ENGINE_TYPE.DPFJ_ENGINE_DPFJ | typeof DPFJ_ENGINE_TYPE.DPFJ_ENGINE_DPFJ7 | typeof DPFJ_ENGINE_TYPE.DPFJ_ENGINE_INNOVATRICS_ANSIISO) => new Promise<any>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_select_engine(reader, engine);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    // public dpfjCreateFmdFromRaw = (imageData: any,
    //     fmdType: typeof DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004 | typeof DPFJ_FMD_FORMAT.DPFJ_FMD_ISO_19794_2_2005,
    //     ) => new Promise<any>((resolve, reject) => {
    //         const ver = ref.alloc(dpfj_version);
    //         const res = UareU.dpfpdd.dpfj_create_fmd_from_raw(ver);
    //         if (res === 0) {
    //             resolve(ver);
    //         } else {
    //             reject(new ErrorHandler(res));
    //         }
    //     });

    public dpfjCreateFmdFromFid = (imageData: any, imageSize: number, fmdType: typeof DPFJ_FMD_FORMAT.DPFJ_FMD_ANSI_378_2004 | typeof DPFJ_FMD_FORMAT.DPFJ_FMD_ISO_19794_2_2005) => new Promise<Fmd>((resolve, reject) => {
        const image = new dpfpdd_capture_callback_data_0(ref.reinterpret(imageData, imageSize));
        const fmd = Buffer.alloc(MAX_FMD_SIZE);
        const fmdSize = ref.alloc(ref.types.uint, MAX_FMD_SIZE);
        const res = UareU.dpfj.dpfj_create_fmd_from_fid(image.capture_parm.image_fmt, image.image_data, image.image_size, fmdType, fmd, fmdSize);
        if (res === 0) {
            resolve({ size: ref.deref(fmdSize), fmdType, data: fmd });
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjCompare = (fmd1: Fmd, fmd2: Fmd) => new Promise<CompareResult>((resolve, reject) => {
        const score = ref.alloc(ref.types.uint);
        const res = UareU.dpfj.dpfj_compare(fmd1.fmdType, fmd1.data, fmd1.size, 0, fmd2.fmdType, fmd2.data, fmd2.size, 0, score);
        if (res === 0) {
            if (score.readUInt8() === 0) {
                resolve({
                    result: 'MATCH',
                    score: score.readUInt8()
                });
            } else {
                resolve({
                    result: 'DONT MATCH',
                    score: score.readUInt8()
                });
            }
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjIdentify = (fmd1: Fmd, fmdList: Fmd[]) => new Promise<IdentifyResult>((resolve, reject) => {
        const candidate = new dpfj_candidate;
        const candidateCnt = ref.alloc(ref.types.uint, 1);
        const falsePositiveRate = DPFJ_PROBABILITY_ONE / 100000;
        const res = UareU.dpfj.dpfj_identify(fmd1.fmdType, fmd1.data, fmd1.size, 0, fmdList[0].fmdType, fmdList.length, fmdList, fmdList, falsePositiveRate, candidateCnt, candidate.ref());
        if (res === 0) {
            resolve({ index: 1 });
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjStartEnrollment = (fmdType: number) => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_start_enrollment(fmdType);
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjAddToEnrollment = (fmd: Fmd) => new Promise<number>((resolve, reject) => {
        console.log(fmd);
        const res = UareU.dpfj.dpfj_add_to_enrollment(fmd.fmdType, fmd.data, fmd.size, 0);
        //get required size for the capabilities structure
        const errorCode = res.toString(16).slice(-3);
        if (res === 0 || errorCode === '00d') {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjCreateEnrollmentFmd = () => new Promise<any>((resolve, reject) => {
        const fmd = Buffer.alloc(MAX_FMD_SIZE);
        const fmdSize = ref.alloc(ref.types.uint, MAX_FMD_SIZE);
        const res = UareU.dpfj.dpfj_create_enrollment_fmd(fmd, fmdSize);
        if (res === 0) {
            resolve(fmd);
        } else {
            reject(new ErrorHandler(res));
        }
    });

    public dpfjFinishEnrollment = () => new Promise<number>((resolve, reject) => {
        const res = UareU.dpfj.dpfj_finish_enrollment();
        if (res === 0) {
            resolve(res);
        } else {
            reject(new ErrorHandler(res));
        }
    });
};
