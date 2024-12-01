// @ts-check

/**
 * @template {Element} T
 */
export class SourceCodeOutput
{
    /**
     * @param {T} element 
     */
    constructor(element)
    {
        this.element = element;
        this.input_container = element.tagName === 'CANVAS' ? element.parentElement : element;
    }

    /**
     * @param {any} properties 
     */
    createUserInput(properties)
    {
        const input = Object.assign(document.createElement('input'), properties);
        this.input_container?.appendChild(input);
        return input;
    }
}