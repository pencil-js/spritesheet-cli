# @pencil.js/spritesheet-cli

[![Package version](https://flat.badgen.net/npm/v/@pencil.js/spritesheet-cli)](https://www.npmjs.com/package/@pencil.js/spritesheet-cli)

CLI for [@pencil.js/spritesheet](https://github.com/pencil-js/spritesheet).

## Installation

    npm install @pencil.js/spritesheet-cli

## CLI

    spritesheet <globPattern> [<options>]

### Options

    --output, -o        Path where to output files      (default: ./)
    --name, -n          Name for the files              (default: spritesheet)
    --template, -t      Template for exporting          (default: standard.json)
    --imageFormat, -f   Result image format             (default: png)
    --margin, -m,       Margin around images            (default: 1)
    --no-crop           Don't crop images
    --cwd, -c           Base directory for all images   (default: ./)
    --silent, -s        Don't log success               (default: false)

### Example

    $ spritesheet *.png -cwd ./src/images/ --output ./dist/assets --name icons

## License

[MIT](license)
