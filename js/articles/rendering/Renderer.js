// @ts-check
import { keysOf } from "../index.js";
import { FixedArray } from "../FixedArray.js";
import { Vector2, Vector4 } from "./math/index.js";
import { TriangleTraversal } from "./TriangleTraversal.js";

/**
 * @template {Record<string, any>} TUniforms
 * @template {{}} TVertexShaderInput
 * @template {{ position: Articles.Rendering.Math.Vector4 }} TFragmentShaderInput
 */
export class Renderer
{
    /**
     * @template {{}} T
     * @param {Articles.Rendering.VertexShaderAtributes<T>} attributes 
     * @return {T}
     */
    static createShaderAttributeValues(attributes)
    {
        // @ts-ignore
        return Object.fromEntries(keysOf(attributes).map(key => [key, attributes[key].createValue()]));
    }

    /**
     * @param {Articles.Rendering.VertexShader<TUniforms, TVertexShaderInput, TFragmentShaderInput>} vertex_shader 
     * @param {Articles.Rendering.FragmentShader<TUniforms, TFragmentShaderInput>} fragment_shader 
     * @param {TUniforms} uniforms 
     */
    constructor(vertex_shader, fragment_shader, uniforms)
    {
        this.element = document.createElement('canvas');
        this.element.width = 640;
        this.element.height = 480;
        this.context = this.element.getContext('2d');
        if (!this.context) throw new Error();
        this.image_data = this.context.getImageData(0, 0, this.element.width, this.element.height);
        this.triangle_traversal = new TriangleTraversal(this.image_data);
        const vertex_shader_input = Renderer.createShaderAttributeValues(vertex_shader.input_attributes);
        const vertex_shader_outputs = FixedArray.create(3, () => Renderer.createShaderAttributeValues(fragment_shader.input_attributes));
        this.vertex_shader = Object.assign(vertex_shader,
        {
            input: vertex_shader_input,
            outputs: vertex_shader_outputs,
            output_positions: FixedArray.map(vertex_shader_outputs, output => output.position)
        });
        this.fragment_shader = Object.assign(fragment_shader,
        {
            input: Renderer.createShaderAttributeValues(fragment_shader.input_attributes),
            output: { color: Vector4.createZero() }
        });
        this.uniforms = uniforms;
    }

    /**
     * @param {Articles.Rendering.DrawData<TVertexShaderInput>} data 
     */
    draw(data)
    {
        const uniforms = this.uniforms;
        const vertex_shader = this.vertex_shader;
        const vertex_shader_input_attribute_names = keysOf(vertex_shader.input_attributes);
        const fragment_shader = this.fragment_shader;
        const fragment_shader_input_attribute_names = keysOf(fragment_shader.input);

        // For each vertex.
        for (const indices of data.indices)
        {
            // Call vertex_shader function.
            for (const i of [0, 1, 2])
            {
                for (const attribute_name of vertex_shader_input_attribute_names) vertex_shader.input[attribute_name] = data.attributes[attribute_name][indices[i]];
                vertex_shader(uniforms, vertex_shader.input, vertex_shader.outputs[i]);
            }

            // If the vertex is outside the viewing frustum, continue to the next one.
            if (vertex_shader.output_positions.some(position => position[3] < 0.0001)) continue;
            
            // Conversion from homogeneous coordinates. Perspective division.
            for (const { position } of vertex_shader.outputs)
            {
                position[0] = position[0] / position[3];
                position[1] = position[1] / position[3];
                position[2] = position[2] / position[3];
            }

            // Conversion to the canvas coordinates that the traversing algorithm expects.
            /** @type {(v: Articles.Rendering.Math.Vector4) => Articles.Rendering.Math.Vector2} */
            const toScreen = ([x, y]) => Vector2.createFromValues([x * 320 + 320, 240 - y * 240]);
            const triangle_to_traverse = FixedArray.map(vertex_shader.output_positions, toScreen);
            
            this.triangle_traversal.traverse(triangle_to_traverse, (_, interpolation) => 
            {
                for (const attribute_name of fragment_shader_input_attribute_names) 
                {
                    const value = fragment_shader.input[attribute_name];
                    const values = FixedArray.createFromValues
                    ([
                        vertex_shader.outputs[0][attribute_name],
                        vertex_shader.outputs[1][attribute_name],
                        vertex_shader.outputs[2][attribute_name]
                    ]);
                    fragment_shader.input_attributes[attribute_name].interpolate(values, interpolation, value);
                }

                // Call fragment_shader function.
                fragment_shader(uniforms, fragment_shader.input, fragment_shader.output);
                return fragment_shader.output.color;
            });
        }
    }

    clear()
    {
        this.image_data.data.fill(255);
    }

    flush()
    {
        this.context.putImageData(this.image_data, 0, 0);
    }
}
