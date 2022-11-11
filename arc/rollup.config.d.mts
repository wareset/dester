export default config;
declare const config: {
    output: {
        format: string;
        dir: string;
        chunkFileNames: string;
        generatedCode: {
            preset: string;
            arrowFunctions: boolean;
            constBindings: boolean;
            objectShorthand: boolean;
            reservedNamesAsProps: boolean;
            symbols: boolean;
        };
    };
    external: (id: any, importree: any) => true;
    plugins: any[];
}[];
