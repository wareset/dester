export function concat(...lists: any[]): any[];
export function filterUnique(arr: any): any;
export function hash(str: any, salt: any): string;
export const isArray: (arg: any) => arg is any[];
export function isBoolean(v: any): boolean;
export function isNumber(v: any): boolean;
export function isObject(v: any): boolean;
export function isString(v: any): boolean;
export const jsonParse: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
export const jsonStringify: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (string | number)[], space?: string | number): string;
};
export const keys: {
    (o: object): string[];
    (o: {}): string[];
};
export function nearly(value: any, pattern: any, method?: number): any;
export function trycatch(tryFn: any, catchFn: any, errorMsg: any): any;
