export declare const isArray: (arg: any) => arg is any[];
export declare const isString: (v: any) => v is string;
export declare const isNumber: (v: any) => v is number;
export declare const isBoolean: (v: any) => v is boolean;
export declare const isObject: (v: any) => v is object;
export declare const jsonStringify: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (string | number)[], space?: string | number): string;
};
export declare const jsonParse: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
export declare const keys: {
    (o: object): string[];
    (o: {}): string[];
};
export declare const concat: <T>(...lists: (T | T[])[]) => T[];
export declare const trycatch: <T, B>(tryFn: () => T, catchFn?: B | ((error?: Error, ...a: any[]) => B), errorMsg?: boolean) => T | B;
export declare const filterUnique: <T>(arr: T[]) => T[];
export declare const hash: (str: any, salt?: string) => string;
export declare const nearly: (value: number, pattern: number | number[], method?: -1 | 0 | 1) => number;
