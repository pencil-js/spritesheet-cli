#!/usr/bin/env node

const { writeFile, mkdir } = require("fs").promises;
const { sep, relative, dirname } = require("path");
const meow = require("meow");
const { hasMagic, sync } = require("glob");
const spritesheet = require("@pencil.js/spritesheet");

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

    const { json, image } = await spritesheet(paths, flags);

    const imagePath = `${flags.path}${sep}${flags.name}.${flags.outputFormat}`;
    const jsonPath = `${flags.path}${sep}${flags.name}.json`;

    json.meta.image = relative(dirname(jsonPath), imagePath);

    process.chdir(startingWD);

    await mkdir(flags.path, {
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
        --path, -p          Path where to output files      (default: ./)
        --name, -n          Name for the files              (default: spritesheet)
        --outputFormat, -f  Result image format             (default: png)
        --margin, -m,       Margin around images            (default: 1)
        --no-crop           Don't crop images
        --cwd, -c           Base directory for all images   (default: ./)
        --silent, -s        Don't log success               (default: false)

    Example
        $ spritesheet *.png -cwd ./src/images/ --path ./dist/assets --name icons
`, {
    flags: {
        path: {
            alias: "p",
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
