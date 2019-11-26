# @pencil.js/spritesheet-cli

[![Package version](https://flat.badgen.net/npm/v/@pencil.js/spritesheet-cli)](https://www.npmjs.com/package/@pencil.js/spritesheet-cli)

CLI for [@pencil.js/spritesheet](https://github.com/pencil-js/spritesheet).

## Installation

    npm install @pencil.js/spritesheet-cli

## CLI

    spritesheet <globPattern> [<options>]

### Options

    --path, -p          Path where to output files      (default: ./)
    --name, -n          Name for the files              (default: spritesheet)
    --imageFormat, -f   Result image format             (default: png)
    --cwd, -c           Base directory for all images   (default: ./)
    --silent, -s        Don't log success               (default: false)

### Example

    $ spritesheet *.png -cwd ./src/images/ --path ./dist/assets --name icons

## License

[MIT](license)
