// @ts-check

/**
 * @template {any} TUniforms
 * @template {any} TInput
 * @template {any} TOutput
 */
export class RendererShader
{
    /**
     * @param {Articles.Rendering.VertexShaderMain<TUniforms, TInput, TOutput>} main
     * @param {() => TInput} input_template
     */
    constructor(main, input_template)
    {
        this.main = main;
        this.input_template = input_template;
    }
}