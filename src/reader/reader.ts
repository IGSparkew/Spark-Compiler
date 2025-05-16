import * as fs from 'fs'; 

const scriptFolderPathName = 'scripts';
const exempleFolderPathName = 'exemples';

export function ScriptReader(argsValues : { [x: string]: string | boolean | (string | boolean)[] | undefined }) : string {

        let folderPathName = scriptFolderPathName;
    
        let file = "";

        if (argsValues.file === undefined && typeof(argsValues.file) !== 'string') {
            throw new Error(`Error no file set to compiled`);
        }

        
        if (typeof(argsValues.exemple) == 'boolean' && argsValues.exemple == true) {
            folderPathName = exempleFolderPathName;
        }
        
        file = argsValues.file as string;

        return fs.readFileSync('./' + folderPathName + "/" + file + ".spk", 'utf-8');
}