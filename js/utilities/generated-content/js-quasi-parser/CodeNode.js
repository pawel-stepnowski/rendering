// @ts-check
import { PartType } from "./PartType.js";

export class CodeNode
{
    /**
     * @param {string[]} source_lines 
     */
    constructor(source_lines)
    {
        this.type = PartType.Code;
        this.source_lines = source_lines;
    }

    toString()
    {
        return this.source_lines.join('\r\n');
    }
}