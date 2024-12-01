// @ts-check
import { Matrix, Matrix2, Matrix4, Vector2, Vector4 } from "../math/index.js";
import { SourceCodeOutput } from "../../../utilities/generated-content/SourceCodeOutput.js";
import { PlaneCanvas } from "../../../utilities/math/PlaneCanvas.js";

/**
 * @returns {Articles.Rendering.Math.Vector4[][]}
 */
export function createBox()
{
    /** @type {Articles.Rendering.Math.Vector4[]} */
    const front = 
    [
        [-1,  1, 1, 1],
        [ 1,  1, 1, 1],
        [ 1, -1, 1, 1],
        [-1, -1, 1, 1]
    ];
    /** @type {Articles.Rendering.Math.Vector4[]} */
    const back = 
    [
        [-1,  1, -1, 1],
        [ 1,  1, -1, 1],
        [ 1, -1, -1, 1],
        [-1, -1, -1, 1]
    ];
    /** @type {Articles.Rendering.Math.Vector4[]} */
    const top = 
    [
        [-1, 1,  1, 1], 
        [ 1, 1,  1, 1], 
        [ 1, 1, -1, 1],
        [-1, 1, -1, 1]
    ];
    /** @type {Articles.Rendering.Math.Vector4[]} */
    const bottom = 
    [
        [-1, -1,  1, 1],
        [ 1, -1,  1, 1],
        [ 1, -1, -1, 1],
        [-1, -1, -1, 1]
    ];
    return [front, back, top, bottom];
}

/**
 * @param {SourceCodeOutput<HTMLCanvasElement>} output
 */
export function render(output)
{
    const front_z = -1.5;
    const front = [[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([x, y]) => Vector4.createFromValues([x, y, front_z, 1]));
    const back_z = -3.5;
    const back = [[-1, 1], [1, 1], [1, -1], [-1, -1]].map(([x, y]) => Vector4.createFromValues([x, y, back_z, 1]));
    const top = [[-1, 1, front_z], [1, 1, front_z], [1, 1, back_z], [-1, 1, back_z]].map(([x, y, z]) => Vector4.createFromValues([x, y, z, 1]));
    const bottom = [[-1, -1, front_z], [1, -1, front_z], [1, -1, back_z], [-1, -1, back_z]].map(([x, y, z]) => Vector4.createFromValues([x, y, z, 1]));
    const faces = [front, back, top, bottom];
    const plane = new PlaneCanvas(output.element);
    const projection = Matrix4.createPerspectiveProjection(0.1, 5, -0.125, 0.125, 0.125, -0.125);
    
    for (const face of faces)
    {
        const projected_face = face.map(v => Matrix.mulVector(projection, v)).map((([x, y, z, w]) => Vector2.createFromValues([x / w, y / w])));
        plane.drawPath(projected_face);
    }

    for (const face of faces)
    {
        const projected_face = face.map(([x, y, z]) => Vector2.createFromValues([x / z, y / z]));
        plane.drawPath(projected_face, { color: 'red' });
    }

}

/**
 * @param {SourceCodeOutput<HTMLCanvasElement>} output
 */
export function exampleOfPerspectiveDivision(output)
{
    /** @type {(v: Articles.Rendering.Math.Vector4) => Articles.Rendering.Math.Vector2} */
    const projection = ([x, y, z]) => Vector2.createFromValues([x / z, y / z]);
    const box = createBox();
    const translation = Matrix4.createTranslation([0, 0, 2]);
    const plane = new PlaneCanvas(output.element);
    const input = output.createUserInput({ type: 'range', min: 0, max: 360, step: 1, value: 0 });
    const draw = () =>
    {
        plane.clear();
        const rotation = Matrix4.createRotationY(input.valueAsNumber * Math.PI / 180);
        const transform = Matrix.mul(translation, rotation);
        for (const face of box)
        {
            const transformed_face = face.map(v => Matrix.mulVector(transform, v));
            const projected_face = transformed_face.map(projection);
            plane.drawPath(projected_face, { color: 'red' });
        }
    };
    input.addEventListener('input', draw);
    draw();
}

/**
 * @returns {Articles.Rendering.Math.Matrix4}
 */
export function createSimpleProjection()
{
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 1, 0]
    ];
}

/**
 * @param {SourceCodeOutput<HTMLCanvasElement>} output
 */
export function exampleOfProjectionWithSimpleMatrix(output)
{
    const projection = createSimpleProjection();
    const box = createBox();
    const translation = Matrix4.createTranslation([0, 0, 2]);
    const plane = new PlaneCanvas(output.element);
    const input = output.createUserInput({ type: 'range', min: 0, max: 360, step: 1, value: 0 });
    /** @type {(v: Articles.Rendering.Math.Vector4) => Articles.Rendering.Math.Vector2} */
    const perspective_division = ([x, y, _, w]) => Vector2.createFromValues([x / w, y / w]);
    const draw = () =>
    {
        plane.clear();
        const rotation = Matrix4.createRotationY(input.valueAsNumber * Math.PI / 180);
        const transform = Matrix.mul(translation, rotation);
        for (const face of box)
        {
            const transformed_face = face.map(v => Matrix.mulVector(transform, v));
            const projected_face = transformed_face.map(v => Matrix.mulVector(projection, v));
            const divided_face = projected_face.map(perspective_division);
            plane.drawPath(divided_face, { color: 'red' });
        }
    };
    input.addEventListener('input', draw);
    draw();
}

/**
 * @param {SourceCodeOutput<HTMLCanvasElement>} output
 */
export function exampleOfPerspectiveProjection(output)
{
    const rotation_input = output.createUserInput({ type: 'range', min: 0, max: 360, step: 1, value: 0 });
    const near_input = output.createUserInput({ type: 'range', min: 0.01, max: 0.5, step: 0.01, value: 0.1 });
    const box = createBox();
    const translation = Matrix4.createTranslation([0, 0, 2]);
    const plane = new PlaneCanvas(output.element);
    /** @type {(v: Articles.Rendering.Math.Vector4) => Articles.Rendering.Math.Vector2} */
    const perspective_division = ([x, y, _, w]) => Vector2.createFromValues([x / w, y / w]);
    const draw = () =>
    {
        const projection = Matrix4.createPerspectiveProjection(near_input.valueAsNumber, 5, -0.125, 0.125, 0.125, -0.125);
        plane.clear();
        const rotation = Matrix4.createRotationY(rotation_input.valueAsNumber * Math.PI / 180);
        const transform = Matrix.mul(translation, rotation);
        for (const face of box)
        {
            const transformed_face = face.map(v => Matrix.mulVector(transform, v));
            const projected_face = transformed_face.map(v => Matrix.mulVector(projection, v));
            const divided_face = projected_face.map(perspective_division);
            plane.drawPath(divided_face, { color: 'red' });
        }
    };
    [rotation_input, near_input].forEach(input => input.addEventListener('input', draw));
    draw();
}