// @ts-check
import { Matrix, Matrix2, Matrix3, Vector3, ONE_DEGREE_IN_RADIANS } from "../math/index.js";
import { SourceCodeOutput } from "../../../utilities/generated-content/SourceCodeOutput.js";
import { PlaneCanvas } from "../../../utilities/math/PlaneCanvas.js";

/**
 * @param {[number, number]} point 
 * @param {number} degrees 
 * @returns {[number, number]}
 */
export function rotate([x, y], degrees)
{
    const sin_a = Math.sin(degrees * ONE_DEGREE_IN_RADIANS);
    const cos_a = Math.cos(degrees * ONE_DEGREE_IN_RADIANS);
    return [ 
        x * cos_a - y * sin_a, 
        x * sin_a + y * cos_a 
    ];
}

/**
 * @param {SourceCodeOutput<HTMLCanvasElement>} output
 */
export function exampleRotation(output)
{
    const plane = new PlaneCanvas(output.element);
    /** @type {[number, number][]} */
    const triangle = [[0, 1], [1, -1], [-1, -1]];
    plane.drawPath(triangle, { point_label: 'pᵢ = (xᵢ, yᵢ)' });
    const rotated_triangle = triangle.map(point => rotate(point, 45));
    plane.drawPath(rotated_triangle, { color: 'blue', point_label: 'p\'ᵢ = (x\'ᵢ, y\'ᵢ)' });
}

/**
 * @param {SourceCodeOutput<HTMLCanvasElement>} output
 */
export function exampleMatrixRotation(output)
{
    const plane = new PlaneCanvas(output.element);
    /** @type {[number, number][]} */
    const triangle = [[0, 1], [1, -1], [-1, -1]];
    plane.drawPath(triangle, { point_label: 'pᵢ = (xᵢ, yᵢ)' });
    const rotation = Matrix2.createRotation(45);
    const rotated_triangle = triangle.map(point => Matrix.mulVector(rotation, point));
    plane.drawPath(rotated_triangle, { color: 'blue', point_label: 'p\'ᵢ = (x\'ᵢ, y\'ᵢ)' });
}

/**
 * @param {SourceCodeOutput<HTMLCanvasElement>} output
 */
export function exampleTransform(output)
{
    const plane = new PlaneCanvas(output.element);
    /** @type {[number, number][]} */
    const triangle = [[0, 1], [1, -1], [-1, -1]];
    const triangle3 = triangle.map(([x, y]) => Vector3.createFromValues([x, y, 1]));
    plane.drawPath(triangle);

    const rotation = Matrix3.createRotation(90);
    const rotated_triangle = triangle3.map(point => Matrix.mulVector(rotation, point));
    plane.drawPath(rotated_triangle.map(([x, y]) => [x, y]), { color: 'gray' });

    const translation = Matrix3.createTranslation([0.3, 0.3]);
    const translated_triangle = triangle3.map(point => Matrix.mulVector(translation, point));
    plane.drawPath(translated_triangle.map(([x, y]) => [x, y]), { color: 'gray' });

    const rotation_translation = Matrix.mul(rotation, translation);
    const rotated_translated_triangle = triangle3.map(point => Matrix.mulVector(rotation_translation, point));
    plane.drawPath(rotated_translated_triangle.map(([x, y]) => [x, y]), { color: 'blue' });
}