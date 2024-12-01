// @ts-check
import { FragmentNode } from "./FragmentNode.js";
import { PartType } from "./PartType.js";

export class FunctionNode
{
    /**
     * @param {string} name 
     * @param {string} signature 
     * @param {FragmentNode} fragment 
     */
    constructor(name, signature, fragment)
    {
        this.type = PartType.Function;
        this.name = name;
        this.signature = signature;
        this.fragment = fragment;
        /** @type {undefined | Articles.Rendering.JS.Parsing.Part} */
        this.previous_part;
    }

    /**
     * @param {string} text 
     */
    hasJSDoc(text)
    {
        return this.previous_part?.type == 'jsdoc' && this.previous_part.source_lines.some(line => line.indexOf(text) >= 0);
    }

    /**
     * @param {'body'} [format]
     */
    toString(format)
    {
        if (format === 'body') return this.fragment.parts.flatMap(part => (part.type == 'function' || part.type == 'class') ? [] : part.source_lines.map(line => line.replace(/^    /, ''))).join('\r\n');
        const jsdoc = this.previous_part?.type == 'jsdoc' ? this.previous_part.source_lines.join('\r\n') + '\r\n' : '';
        return `${jsdoc}function ${this.name}(${this.signature})\r\n{\r\n${this.fragment}\r\n}`;
    }
}