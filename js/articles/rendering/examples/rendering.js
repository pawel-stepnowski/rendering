// @ts-check
import { Vector3, Matrix, Matrix4 } from "../math/index.js";
import { Renderer } from "../Renderer.js";
import { ShaderAttributeVector3 } from "../ShaderAttributeVector3.js";
import { ShaderAttributeVector4 } from "../ShaderAttributeVector4.js";
import { SourceCodeOutput } from "../../../utilities/generated-content/SourceCodeOutput.js";

/** @typedef {{ position: Articles.Rendering.Math.Vector3, color: Articles.Rendering.Math.Vector3 }} VertexShaderInput */
/**
 * @param {ReturnType<createUniforms>} uniforms 
 * @param {VertexShaderInput} input 
 * @param {FragmentShaderInput} output 
 */
function vertexShader(uniforms, input, output)
{
    const [x, y, z] = input.position;
    const vertex1 = Matrix.mulVector(uniforms.model, [x, y, z, 1]);
    const vertex2 = Matrix.mulVector(uniforms.view, vertex1);
    output.color = input.color;
    Matrix.mulVector(uniforms.projection, vertex2, output.position);
}

/** @typedef {{ position: Articles.Rendering.Math.Vector4, color: Articles.Rendering.Math.Vector3 }} FragmentShaderInput */
/**
 * @param {ReturnType<createUniforms>} uniforms 
 * @param {FragmentShaderInput} input 
 * @param {{ color: Articles.Rendering.Math.Vector4 }} output 
 */
function fragmentShader(uniforms, input, output)
{
    const [r, g, b] = input.color;
    output.color = [r, g, b, 1];
}

function createUniforms()
{
    const uniforms =
    { 
        projection: Matrix4.createPerspectiveProjection(0.1, 10, -0.1, 0.1, 0.1, -0.1),
        model: Matrix4.createRotationY(0),
        view: Matrix4.createTranslation([0, 0, -3]),
    };
    return uniforms;
}

function createDrawData()
{
    const a = Vector3.createFromValues([-1, -1, 0]);
    const b = Vector3.createFromValues([ 0,  1, 0]);
    const c = Vector3.createFromValues([ 1, -1, 0]);
    const red = Vector3.createFromValues([1, 0, 0]);
    const green = Vector3.createFromValues([0, 1, 0]);
    const blue = Vector3.createFromValues([0, 0, 1]);
    const triangle = Vector3.createFromValues([0, 1, 2]);
    const data =
    {
        indices: [triangle],
        attributes:
        {
            position: [a, b, c],
            color: [red, green, blue]
        }
    };
    return data;
}

/**
 * @param {SourceCodeOutput<Element>} output 
 * @returns 
 */
function createRenderer(output)
{
    const uniforms = createUniforms();
    const vertex_shader_input_attributes =
    {
        position: new ShaderAttributeVector3(), 
        color: new ShaderAttributeVector3()
    };
    const fragment_shader_input_attributes =
    {
        position: new ShaderAttributeVector4(), 
        color: new ShaderAttributeVector3() 
    };
    const vertex_shader = Object.assign(vertexShader, { input_attributes: vertex_shader_input_attributes });
    const fragment_shader = Object.assign(fragmentShader, { input_attributes: fragment_shader_input_attributes });
    const renderer = new Renderer(vertex_shader, fragment_shader, uniforms);
    output.element.appendChild(renderer.element);
    return renderer;
}

function createTriangleTranslations()
{
    const triangle_1 = { translation: Matrix4.createTranslation([1, 0, 0]) };
    const triangle_2 = { translation: Matrix4.createTranslation([-1, 0, 0]) };
    return [triangle_1, triangle_2];
}

/**
 * @param {SourceCodeOutput<Element>} output
 */
export function render(output)
{
    const renderer = createRenderer(output);
    const draw_data = createDrawData();
    const user_input_properties = { type: 'range', min: 0, max: 360, step: 1, value: 0 };
    const triangles = createTriangleTranslations().map(({ translation }) => 
        ({ translation, input: output.createUserInput(user_input_properties) }));
    const draw = () => 
    {
        renderer.clear();
        for (const { translation, input } of triangles)
        {
            const rotation = Matrix4.createRotationY(input.valueAsNumber * Math.PI / 180);
            renderer.uniforms.model = Matrix.mul(translation, rotation);
            renderer.draw(draw_data);
        }
        renderer.flush();
    };
    triangles.forEach(({ input }) => input.addEventListener('input', draw));
    draw();
}