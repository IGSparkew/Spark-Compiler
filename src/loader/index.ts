import { FileLoader } from "./fileloader";


export function FileLoad(code: string, path: string) {
    const fl = new FileLoader(code, path);
    return fl.load();
}