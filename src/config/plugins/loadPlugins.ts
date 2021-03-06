import * as Hapi from "@hapi/hapi";
import * as fs from "fs";
import { Container } from "inversify";
import * as path from "path";
import { IPlugin } from "../../interfaces";

export function LoadPlugins(container: Container, server: Hapi.Server): Promise<any> {
    const pluginPromises: Array<Promise<any>> = [];

    const pluginsPath = __dirname + "/";
    const plugins = fs.readdirSync(pluginsPath)
        .filter((file) => fs.statSync(path.join(pluginsPath, file)).isDirectory());
    plugins.forEach((pluginName: string) => {
        const plugin: IPlugin = (require("./" + pluginName)).default();
        console.log(`Register Plugin ${plugin.info().name} v${plugin.info().version}`);
        pluginPromises.push(plugin.register(container, server));
    });

    return Promise.all(pluginPromises);
}
