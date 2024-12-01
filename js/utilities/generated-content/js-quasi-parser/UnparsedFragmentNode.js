// @ts-check
import { FragmentNode } from "./FragmentNode.js";

export class UnparsedFragmentNode extends FragmentNode
{
    /**
     * @param {string} source 
     */
    constructor(source)
    {
        super();
        this.source = source;
    }

    toString()
    {
        return this.source;
    }
}