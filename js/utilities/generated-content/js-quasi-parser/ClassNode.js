// @ts-check
import { FragmentNode } from "./FragmentNode.js";
import { PartType } from "./PartType.js";

export class ClassNode
{
    /**
     * @param {string} name 
     * @param {FragmentNode} fragment 
     */
    constructor(name, fragment)
    {
        this.type = PartType.Class;
        this.name = name;
        this.fragment = fragment;
        /** @type {undefined | Articles.Rendering.JS.Parsing.Part} */
        this.previous_part;
    }
}