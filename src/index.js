#!/usr/bin/env node

import { writeFile, mkdir } from "fs/promises";
import { sep, relative, dirname } from "path";
import meow from "meow";
import glob from "glob";
import spritesheet from "@pencil.js/spritesheet";

const { hasMagic, sync } = glob;

const run = async (cli) => {
    const { input, flags } = cli;

    const log = (...args) => {
        if (!flags.silent) {
            console.log(...args);
        }
    };

    if (!input.length) {
        cli.showHelp();
        return;
    }

    const startingWD = process.cwd();
    process.chdir(flags.cwd);

    const paths = input.reduce((acc, val) => {
        if (hasMagic(val)) {
            return acc.concat(sync(val, {
                nodir: true,
            }));
        }

        acc.push(val);
        return acc;
    }, []);

    log(`Packing ${paths.length} files ...`);

    const imagePath = `${flags.output}${sep}${flags.name}.${flags.outputFormat}`;
    const jsonPath = `${flags.output}${sep}${flags.name}.json`;

    const { json, image } = await spritesheet(paths, {
        outputFormat: flags.outputFormat,
        outputName: relative(dirname(jsonPath), imagePath),
        margin: flags.margin,
        crop: flags.crop,
    });

    process.chdir(startingWD);

    await mkdir(flags.output, {
        recursive: true,
    });

    await writeFile(imagePath, image);
    log("✔️ Image created");

    await writeFile(jsonPath, JSON.stringify(json));
    log("✔️ JSON created");
};

const index = meow(`
    Usage
        $ spritesheet <globPattern> [<options>]

    Options
        --output, -o        Path where to output files      (default: ./)
        --name, -n          Name for the files              (default: spritesheet)
        --outputFormat, -f  Result image format             (default: png)
        --margin, -m,       Margin around images            (default: 1)
        --no-crop           Don't crop images
        --cwd, -c           Base directory for all images   (default: ./)
        --silent, -s        Don't log success               (default: false)

    Example
        $ spritesheet *.png -cwd ./src/images/ --output ./dist/assets --name icons
`, {
    flags: {
        output: {
            alias: "o",
            type: "string",
            default: "./",
        },
        name: {
            alias: "n",
            type: "string",
            default: "spritesheet",
        },
        outputFormat: {
            alias: "f",
            type: "string",
            default: "png",
        },
        margin: {
            alias: "m",
            type: "number",
            default: 1,
        },
        crop: {
            type: "boolean",
            default: true,
        },
        cwd: {
            alias: "c",
            type: "string",
            default: "./",
        },
        silent: {
            alias: "s",
            type: "boolean",
            default: false,
        },
    },
});

run(index);
