// @ts-check
import { ClassNode } from "./ClassNode.js";
import { FragmentNode } from "./FragmentNode.js";
import { FunctionNode } from "./FunctionNode.js";

export class MethodNode extends FunctionNode
{
    /**
     * @param {string} class_name 
     * @param {FunctionNode[]} nodes 
     */
    static toString(class_name, nodes)
    {
        const c1 = `class ${class_name}\r\n`;
        const c2 = `{\r\n`;
        const c3 = `    ...\r\n`;
        const ms = nodes.map(node => 
        {
            const jsdoc = node.previous_part?.type == 'jsdoc' ? node.previous_part.source_lines.join('\r\n') + '\r\n' : '';
            const m1 = `${jsdoc}    ${node.name}(${node.signature})\r\n`;
            const m2 = `    {\r\n`;
            const m3 = `${node.fragment}\r\n`;
            const m4 = `    }\r\n`;
            return m1 + m2 + m3 + m4;
        }).join(`    ...\r\n`);
        const c8 = `    ...\r\n`;
        const c9 = `}`;
        return c1 + c2 + c3 + ms + c8 + c9;
    }

    /**
     * @param {ClassNode} class_node 
     * @param {FunctionNode} function_node 
     */
    static fromFunctionNode(class_node, { name, signature, fragment, previous_part })
    {
        const node = new MethodNode(name, signature, fragment, class_node);
        node.previous_part = previous_part;
        return node;
    }

    /**
     * @param {string} name
     * @param {string} signature
     * @param {FragmentNode} fragment
     * @param {ClassNode} clazz
     */
    constructor(name, signature, fragment, clazz)
    {
        super(name, signature, fragment);
        this.class = clazz;
    }

    toString()
    {
        const jsdoc = this.previous_part?.type == 'jsdoc' ? this.previous_part.source_lines.join('\r\n') + '\r\n' : '';
        return `class ${this.class.name}\r\n{\r\n    ...\r\n${jsdoc}    ${this.name}(${this.signature})\r\n    {\r\n${this.fragment}\r\n    }\r\n    ...\r\n}`;
    }
}