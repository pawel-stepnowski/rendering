// @ts-check
import * as Quasi from "./js-quasi-parser/index.js"
import { SourceCodeOutput } from "./SourceCodeOutput.js";
import { SourceCodeRendererModule } from "./SourceCodeRendererModule.js";

export class SourceCodeRenderer
{
    /**
     * @param {Record<string, SourceCodeRendererModule>} modules
     */
    constructor(modules)
    {
        this.element = document.createElement('div');
        this.modules = modules;
    }
    
    render()
    {
        for (const container of document.querySelectorAll('.content-generated-from-code')) this.renderContainer(container);
    }
    
    /**
     * @param {Element} container 
     */
    async renderContainer(container)
    {
        function getOutput()
        {
            const output_selector = container.getAttribute('output');
            if (!output_selector) return;
            if (output_selector.startsWith(':parent'))
            {
                if (container.parentElement)
                {
                    const output_element = container.parentElement.querySelector(output_selector.replace(':parent', ':scope'));
                    if (output_element) return new SourceCodeOutput(output_element);
                }
            }
        }

        const module_name = container.getAttribute('module');
        if (!module_name) return;
        const module = this.modules[module_name];
        const function_selector = container.getAttribute('function');
        const output = getOutput();

        /**
         * @param {Element} container 
         * @param {string} source_code 
         */
        const renderPrism = (container, source_code) =>
        {
            container.removeAttribute('style');
            const prism = this._createPrismElement();
            prism.code.textContent = source_code;
            container.appendChild(prism.pre);
            // @ts-ignore
            Prism.highlightAllUnder(prism.pre);
        };

        if (function_selector)
        {
            const function_nodes = this.modules[module_name].getFunctionNode(function_selector);
            if (!function_nodes)
            {
                renderPrism(container, 'NOT FOUND');
                return;
            }
            if (output)
            {
                if (function_nodes.length != 1)
                {
                    renderPrism(container, 'Multiple functions not supported with output.');
                    return;
                }
                const function_node = function_nodes[0];
                renderPrism(container, function_node.toString('body'));
                module.handle[function_selector](output);
            }
            else
            {
                if (function_nodes[0] instanceof Quasi.MethodNode)
                {
                    renderPrism(container, Quasi.MethodNode.toString(function_nodes[0].class.name, function_nodes));
                }
                else
                {
                    if (function_nodes.length != 1)
                    {
                        renderPrism(container, 'Multiple functions not supported.');
                        return;
                    }
                    renderPrism(container, function_nodes[0].toString());
                }
            }
        }
        else
        {
            if (this.modules[module_name].tree) renderPrism(container, this.modules[module_name].tree.toString());
            else renderPrism(container, 'NOT FOUND');
        }
    }

    /**
     * @param {string} language 
     * @returns 
     */
    _createPrismElement(language = 'language-typescript')
    {
        const pre = Object.assign(document.createElement('pre'));
        const code = Object.assign(document.createElement('code'));
        code.classList.add(language);
        pre.appendChild(code);
        return { pre, code };
        // @ts-ignore
        // Prism.highlightAllUnder(p);
    }
}
