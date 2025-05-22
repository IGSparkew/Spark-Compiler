import { Compile } from "./compiler";
import { parseArgs } from 'util'
import { options } from "./options";
import { ScriptReader } from "./reader/reader";
import { FileLoad } from "./loader";
/**
 * ################################################################################
 * #                                                                              #
 * #                                                                              #
 * #    _____                  _       _____                      _ _             #
 * #   / ____|                | |     / ____|                    (_) |            #
 * #  | (___  _ __   __ _ _ __| | __ | |     ___  _ __ ___  _ __  _| | ___ _ __   #
 * #   \___ \| '_ \ / _` | '__| |/ / | |    / _ \| '_ ` _ \| '_ \| | |/ _ \ '__|  #
 * #   ____) | |_) | (_| | |  |   <  | |___| (_) | | | | | | |_) | | |  __/ |     #
 * #  |_____/| .__/ \__,_|_|  |_|\_\  \_____\___/|_| |_| |_| .__/|_|_|\___|_|     #
 * #         | |                                           | |                    #
 * #         |_|                                           |_|                    #
 * #                                                                              #
 * #                                                                              #
 * ################################################################################
 * 
 * Author IGSparkew
 */

function main() {

    const {values} = parseArgs({
        args: Bun.argv,
        options: options,
        strict: true,
        allowPositionals: true
    })

    const {path, code} = ScriptReader(values);
    const finalCode = FileLoad(code, path);
    Compile(finalCode , values.debug as boolean, !values.ascii as boolean, !!values.lexer as boolean, !!values.parser as boolean);
}

main();
