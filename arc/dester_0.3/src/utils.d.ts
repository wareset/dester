import { statSync as fsStatSync } from 'fs';
export declare const toPosix: (str: string) => string;
export declare const isAllowedFile: (file: string, input?: string) => boolean;
export declare const existsStatSync: (directory: string) => false | ReturnType<typeof fsStatSync>;
export declare const isDirectory: (directory: string) => boolean;
export declare const removeSync: (filepath: string) => boolean;
export declare const createDirSync: (filepath: string, throwler?: any) => boolean | never;
export declare const getConfigDir: (config: string | boolean, defs: string[], silent?: boolean) => string;
export declare const processExit: (cb: (...a: any[]) => void) => void;
export declare const isJTSX: (fileOrExt: string) => boolean;
export declare type TypeInputFile = {
    dir: string;
    name: string;
    ext: string;
    final: string;
    origin: string;
};
export declare type TypeInputFiles = {
    include: TypeInputFile[];
    exclude: TypeInputFile[];
};
export declare const getInputFiles: (input: string) => TypeInputFiles;
