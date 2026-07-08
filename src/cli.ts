#!/usr/bin/env node
import { runCli } from "./cli-core.js";

process.exitCode = runCli(process.argv.slice(2));
