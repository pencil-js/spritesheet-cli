#!/usr/bin/env node

import { writeFile, mkdir } from "fs/promises";
import { sep, relative, dirname, extname } from "path";
import meow from "meow";
import glob from "glob";
import spritesheet from "@pencil.js/spritesheet";
import exporter from "./exporter.js";

const { hasMagic, sync } = glob;

const run = async (cli) => {
    const { input, flags } = cli;

    if (!input.length) {
        cli.showHelp();
        return;
    }

    const { cwd, output, name, imageFormat, margin, crop, template, silent } = flags;

    const log = (...args) => {
        if (!silent) {
            console.log(...args);
        }
    };

    const startingWD = process.cwd();
    process.chdir(cwd);

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

    const exportFormat = extname(template);
    const imagePath = `${output}${sep}${name}.${imageFormat}`;
    const jsonPath = `${output}${sep}${name}${exportFormat}`;

    const { json, image } = await spritesheet(paths, {
        imageFormat,
        outputName: relative(dirname(jsonPath), imagePath),
        margin,
        crop,
    });

    process.chdir(startingWD);

    await mkdir(output, {
        recursive: true,
    });

    await writeFile(imagePath, image);
    log("✔️ Image created");

    const content = await exporter(template, {
        homepage: json.meta.app,
        version: json.meta.version,
        outputName: json.meta.image,
        scale: json.meta.scale,
        width: json.meta.size.w,
        height: json.meta.size.h,
        frames: Object.keys(json.frames).map((fileName) => {
            const { frame, rotated, trimmed, spriteSourceSize, sourceSize } = json.frames[fileName];
            return {
                fileName,
                x: frame.x,
                y: frame.y,
                width: frame.w,
                height: frame.h,
                rotated,
                trimmed,
                offsetX: spriteSourceSize.x,
                offsetY: spriteSourceSize.y,
                offsetWidth: spriteSourceSize.w,
                offsetHeight: spriteSourceSize.h,
                sourceWidth: sourceSize.w,
                sourceHeight: sourceSize.h,
            };
        }),
    });
    await writeFile(jsonPath, content);
    log("✔️ Data file created");
};

const index = meow(`
    Usage
        $ spritesheet <globPattern> [<options>]

    Options
        --output, -o        Path where to output files      (default: ./)
        --name, -n          Name for the files              (default: spritesheet)
        --template, -t      Template for exporting          (default: standard.json)
        --imageFormat, -f   Result image format             (default: png)
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
        template: {
            alias: "t",
            type: "string",
            default: "standard.json",
        },
        imageFormat: {
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
