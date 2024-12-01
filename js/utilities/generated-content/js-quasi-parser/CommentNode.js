// @ts-check
import { PartType } from "./PartType.js";

export class CommentNode
{
    /**
     * @param {string[]} source_lines 
     * @param {string[]} comment_text
     */
    constructor(source_lines, comment_text)
    {
        this.type = PartType.Comment;
        this.source_lines = source_lines;
        this.comment_text = comment_text;
        /** @type {undefined | string} */
        let tags_text;
        this.source_lines[0] = this.source_lines[0].replace(/^(\[[^\]]+\])+/, text => { tags_text = text; return '' });
        this.tags = tags_text?.split(/[\[\]]/) ?? [];
        /** @type {undefined | Articles.Rendering.JS.Parsing.Part} */
        this.previous_part;
    }

    toString()
    {
        return this.source_lines.join('\r\n');
    }
}