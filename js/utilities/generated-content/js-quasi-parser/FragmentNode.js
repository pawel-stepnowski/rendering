// @ts-check
import { ClassNode } from "./ClassNode.js";
import { FunctionNode } from "./FunctionNode.js";

export class FragmentNode
{
    constructor()
    {
        /** @type {Articles.Rendering.JS.Parsing.Part[]} */
        this.parts = [];
        /** @type {Record<string, FunctionNode>} */
        this.functions = {};
        /** @type {Record<string, ClassNode>} */
        this.classes = {};
    }

    toString()
    {
        return this.parts.flatMap(part => (part.type == 'function' || part.type == 'class') ? [] : part.source_lines).join('\r\n');
    }
}