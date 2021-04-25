import { readFile } from "fs/promises";

function moustache (template, scope) {
    return template.replace(/{{(.+)}}/g, (_, group) => JSON.stringify(scope[group.trim()]));
}

export default async (templateName = "standard.json", data) => {
    if (templateName.includes("..")) {
        throw new Error(`Path to template is invalid.
[${templateName}]`);
    }

    const file = await readFile(new URL(`./templates/${templateName}`, import.meta.url));
    const content = file.toString();

    const [, before, separator, loop, after] = content.match(/(.+){{ each (.) }}(.+){{ \/each }}(.+)/is);
    const frames = data.frames.map(frame => moustache(loop, frame));
    return `${moustache(before, data)}${frames.join(separator)}${moustache(after, data)}`;
};
