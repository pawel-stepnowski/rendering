// @ts-check
import { FragmentNode } from "./js-quasi-parser/FragmentNode.js";
import { FunctionNode } from "./js-quasi-parser/FunctionNode.js";
import { Parser } from "./js-quasi-parser/Parser.js";
import { UnparsedFragmentNode } from "./js-quasi-parser/UnparsedFragmentNode.js";

export class SourceCodeRendererModule
{
    static parser = new Parser();

    /**
     * @param {string} module_url 
     */
    static async parse(module_url)
    {
        // @ts-ignore
        const handle = await import('./../../.' + module_url);
        const source = await (await fetch(module_url)).text();
        const tree = SourceCodeRendererModule.parser.parseFragment(source);
        return new SourceCodeRendererModule(handle, tree);
    }

    /**
     * @param {string} url 
     */
    static async unparsed(url)
    {
        const source = await (await fetch(url)).text();
        const fragment = new UnparsedFragmentNode(source);
        return new SourceCodeRendererModule(null, fragment);
    }

    /**
     * @param {any} handle 
     * @param {FragmentNode} [tree]
     */
    constructor(handle, tree)
    {
        this.handle = handle;
        this.tree = tree;
        /** @type {Map<string, FragmentNode>} */
        this.classes = new Map();
    }

    /**
     * @param {string} selector 
     * @returns {FunctionNode[] | undefined}
     */
    getFunctionNode(selector)
    {
        const selector_components = selector.split('.');
        if (this.tree)
        {
            const tree = this.tree;
            if (selector_components.length == 2)
            {
                const [class_name, method_names_concatenated] = selector_components;
                const method_names = method_names_concatenated.split(',');
                return method_names.map(method_name => tree.classes[class_name].fragment.functions[method_name]);
            }
            return [this.tree.functions[selector]];

        }
        else
        {
            if (selector_components.length == 2)
            {
                const [class_name, method_name] = selector_components;
                let class_tree = this.classes.get(class_name);
                if (!class_tree)
                {
                    const class_handle = this.handle[class_name];
                    class_tree = SourceCodeRendererModule.parser.parseFragment(class_handle.toString());
                    this.classes.set(class_name, class_tree);
                }
                return [class_tree.functions[method_name]];
            }
        }
    }
}