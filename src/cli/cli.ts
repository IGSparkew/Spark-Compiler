#! /usr/bin/env bun

import { Compile } from "../compiler/index";
import { parseArgs } from 'util'
import { optionsCli } from "../options";
import { CLIReader } from "../reader/reader";

const {values} = parseArgs({
    args: Bun.argv,
    options: optionsCli,
    strict: true,
    allowPositionals: true
})

try {
    const code = CLIReader(values);
    Compile(code);
} catch (err) {
  console.error("Erreur lors de la lecture du fichier:", err);
}