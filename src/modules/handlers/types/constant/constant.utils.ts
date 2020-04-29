import { KeyByValue } from "./constant.interface";

const keyByValue: KeyByValue = (object: object, value: any) => Object.keys(object).find(key => object[key] === value);

export default keyByValue;