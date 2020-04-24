export default interface CaptureCallback {
    (context: any, reserved: number, callbackDataSize: number, callbackData: any): any;
}