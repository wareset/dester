declare const sortPackageJson: <T extends {
    [key: string]: any;
}>(obj: T) => T;
export default sortPackageJson;
