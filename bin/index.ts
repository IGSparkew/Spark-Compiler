#! /usr/bin/env bun

import { Compile } from "../src/compiler/index";
import { parseArgs } from 'util'
import { optionsCli } from "../src/options";
import { ScriptReader } from "../src/reader/reader";

const {values} = parseArgs({
    args: Bun.argv,
    options: optionsCli,
    strict: true,
    allowPositionals: true
})

const code = ScriptReader(values);
Compile(code);