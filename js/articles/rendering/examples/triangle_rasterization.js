// @ts-check
import { BarycentricCoordinates } from "../math/BarycentricCoordinates.js";
import { TriangleTraversal } from "../TriangleTraversal.js";
import { SourceCodeOutput } from "../../../utilities/generated-content/SourceCodeOutput.js";

/**
 * @param {SourceCodeOutput<HTMLCanvasElement>} output
 */
export function rasterizationExample(output)
{
    const context = output.element.getContext('2d');
    if (!context) throw new Error();
    const { width, height } = output.element;
    /** @type {[[number, number], [number, number], [number, number]]} */
    const triangle = [
        [Math.round(width * 0.1), Math.round(height * 0.1)],
        [Math.round(width * 0.5), Math.round(height * 0.9)],
        [Math.round(width * 0.9), Math.round(height * 0.4)]
    ];
    const image = context.getImageData(0, 0, width, height);
    const traversal = new TriangleTraversal(image);
    traversal.traverse(triangle, () => [1, 0, 0, 1]);
    context.putImageData(image, 0, 0);
}
