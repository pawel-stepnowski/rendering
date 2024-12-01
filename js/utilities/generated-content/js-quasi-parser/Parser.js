// @ts-check
import { FragmentNode } from "./FragmentNode.js";
import { CodeNode } from "./CodeNode.js";
import { CommentNode } from "./CommentNode.js";
import { FunctionNode } from "./FunctionNode.js";
import { PartType } from "./PartType.js";
import { ClassNode } from "./ClassNode.js";
import { MethodNode } from "./MethodNode.js";

export class Parser
{
    constructor()
    {
    }

    /**
     * @param {Function} handle
     * @returns {Articles.Rendering.JS.Parsing.Function} 
     */
    parseFunction(handle)
    {
        const fragment = this.parseFragment(handle.toString());
        if (fragment.parts.length != 1 || fragment.parts[0].type != 'function') throw new Error();
        return fragment.parts[0];
    }

    /**
     * @param {string} source
     * @returns {FragmentNode} 
     */
    parseFragment(source)
    {
        const source_lines = source.split('\r\n');
        if (source_lines.length > 0 && /^\/\/ @ts-check/.exec(source_lines[0])) source_lines.shift();
        const state = { position: 0, source_lines, block_depth: 0 };
        return this._parseFragment(state, false);
    }
    
    /**
     * @param {Articles.Rendering.JS.Parsing.ParsingState} state
     * @param {boolean} of_class
     * @returns {undefined | FunctionNode}
     */
    _parseFunction(state, of_class)
    {
        const source_line = state.source_lines[state.position];
        const function_pattern = /^\s*(export )?function\s*(?<name>[^(]+)\((?<signature>.*)\)/;
        const method_pattern = /^\s*(static\s+)?(?<name>[a-zA-Z0-9_]+)\((?<signature>.*)\)\s*/;
        const pattern = of_class ? method_pattern : function_pattern;
        const match = pattern.exec(source_line);
        if (!match) return;
        const name = match.groups?.name ?? '';
        const signature = match.groups?.signature ?? '';
        state.position++;
        const fragment = this._parseBlock(state, false);
        if (!fragment) throw new Error();
        // return of_class ? new MethodNode(name, signature, fragment) : new FunctionNode(name, signature, fragment);
        return new FunctionNode(name, signature, fragment);
    }
    
    /**
     * @param {Articles.Rendering.JS.Parsing.ParsingState} state
     * @param {boolean} of_class 
     * @returns {undefined | FragmentNode}
     */
    _parseBlock(state, of_class)
    {
        {
            const source_line = state.source_lines[state.position];
            const match = /^\s*{/.exec(source_line);
            if (!match) return;
            state.position++;
        }
        state.block_depth++;
        const parts = this._parseFragment(state, of_class);
        {
            const source_line = state.source_lines[state.position];
            const match = /^\s*}/.exec(source_line);
            if (!match) throw new Error();
            state.position++;
        }
        state.block_depth--;
        return parts;
    }
    
    /**
     * @param {Articles.Rendering.JS.Parsing.ParsingState} state
     * @param {boolean} of_class
     * @returns {FragmentNode}
     */
    _parseFragment(state, of_class)
    {
        const block_depth = state.block_depth;
        const fragment = new FragmentNode();
        /** @type {string[]} */
        let code_source_lines = [];
        let previous_part;
        function flushCodeNode()
        {
            while (code_source_lines.length > 0 && code_source_lines[0].match(/^\s*$/)) code_source_lines.shift();
            while (code_source_lines.length > 0 && code_source_lines[code_source_lines.length - 1].match(/^\s*$/)) code_source_lines.pop();
            if (code_source_lines.length > 0) 
            {
                fragment.parts.push(new CodeNode(code_source_lines));
                code_source_lines = [];
            }
        };
        while (state.position < state.source_lines.length)
        {
            const part = this._parseComment(state) || this._parseFunction(state, of_class) || this._parseJSDoc(state) || this._parseClass(state);
            if (part) 
            {
                flushCodeNode();
                fragment.parts.push(part);
                if (part instanceof FunctionNode) fragment.functions[part.name] = part;
                if (part instanceof ClassNode) fragment.classes[part.name] = part;
                part.previous_part = previous_part;
                previous_part = part;
            }
            else
            {
                const source_line = state.source_lines[state.position];
                if (/^\s*{/.exec(source_line)) state.block_depth++;
                else if (/^\s*}/.exec(source_line))
                {
                    if (state.block_depth == block_depth) break;
                    state.block_depth--;
                }
                state.position++;
                if (/^\s*import/.exec(source_line)) continue;
                code_source_lines.push(source_line);
            }
        }
        flushCodeNode();
        return fragment;
    }
    
    /**
     * @param {Articles.Rendering.JS.Parsing.ParsingState} state
     * @returns {undefined | CommentNode}
     */
    _parseComment(state)
    {
        const source_lines = []
        const comment_text = []
        while (true)
        {
            const source_line = state.source_lines[state.position];
            const match = /^\s*\/\/\s?(.*)/.exec(source_line);
            if (!match) break;
            state.position++;
            if (match[1] === '@ts-ignore') continue;
            source_lines.push(source_line);
            comment_text.push(match[1]);
        }
        if (source_lines.length == 0) return;
        return new CommentNode(source_lines, comment_text);
    }

    /**
     * @param {Articles.Rendering.JS.Parsing.ParsingState} state
     * @returns {undefined | Articles.Rendering.JS.Parsing.JSDoc}
     */
    _parseJSDoc(state)
    {
        const source_lines = []
        {
            const source_line = state.source_lines[state.position];
            const match = /^\s*\/\*\*.*\*\/\s*$/.exec(source_line);
            if (match)
            {
                state.position++;
                return { type: PartType.JSDoc, source_lines: [source_line], previous_part: undefined };
            }
        }
        {
            const source_line = state.source_lines[state.position];
            const match = /^\s*\/\*\*/.exec(source_line);
            if (!match) return;
            source_lines.push(source_line);
            state.position++;
        }
        while (state.position < state.source_lines.length)
        {
            const source_line = state.source_lines[state.position];
            const match = /^\s*\*[^\/]/.exec(source_line);
            if (!match) break;
            source_lines.push(source_line);
            state.position++;
        }
        {
            const source_line = state.source_lines[state.position];
            const match = /^\s*\*\//.exec(source_line);
            if (!match) throw new Error();
            source_lines.push(source_line);
            state.position++;
            return { type: PartType.JSDoc, source_lines, previous_part: undefined };
        }
    }

    /**
     * @param {Articles.Rendering.JS.Parsing.ParsingState} state
     * @returns {undefined | Articles.Rendering.JS.Parsing.Class}
     */
    _parseClass(state)
    {
        const source_line = state.source_lines[state.position];
        const match = /^\s*(export\s+)?class\s*(\S+)/.exec(source_line);
        if (!match) return;
        let name = match[2];
        state.position++;
        const fragment = this._parseBlock(state, true);
        if (!fragment) throw new Error();
        const class_node = new ClassNode(name, fragment);
        class_node.fragment.parts = class_node.fragment.parts.map(part => part instanceof FunctionNode ? MethodNode.fromFunctionNode(class_node, part) : part);
        class_node.fragment.parts.filter(part => part instanceof MethodNode).forEach(part => class_node.fragment.functions[part.name] = part);
        return class_node;
    }
}