import DllHandler from "./handlers/dll/dll.handler";
import ErrorHandler from "./handlers/error/error.handler";
import * as ref from 'ref-napi';
import { dpfpdd_version, dpfpdd_dev_info, dpfpdd_dev_status, dpfpdd_dev_caps } from "./handlers/types/struct/struct.handler";
import { genericArrayFrom } from "./handlers/types/array/array.handler";
import QueryDevices from "./interfaces/query-devices.interface";
import { DPFPDD_DEV, DPFPDD_PRIORITY } from "./handlers/types/constant/constant.handler";

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
        const MAX_DEVICE_NUMBER = 5;
        const dev_infos = genericArrayFrom(dpfpdd_dev_info, MAX_DEVICE_NUMBER);
        const devCnt = Buffer.alloc(ref.types.uint.size, MAX_DEVICE_NUMBER);
        const res = UareU.dpfpdd.dpfpdd_query_devices(devCnt, dev_infos);
        if (res === 0) {
            const deviceList: QueryDevices = {
                devicesNumber: devCnt.readInt8(),
                devicesList: [],
            }
            for (let i: number = 1; i <= devCnt.readInt8(); i++) {
                const device = new dpfpdd_dev_info(ref.reinterpret(dev_infos, 1452, ((i - 1) * 1452)));
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
};
