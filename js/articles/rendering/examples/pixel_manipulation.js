// @ts-check
import { SourceCodeOutput } from "../../../utilities/generated-content/SourceCodeOutput.js";

/**
 * @param {SourceCodeOutput<HTMLCanvasElement>} output
 */
export function example1(output)
{
    const context = output.element.getContext('2d');
    if (!context) throw new Error();
    const { width, height } = output.element;
    const image = context.getImageData(0, 0, width, height);
    const pixel_size = 4;
    for (let pixel_index = 0, y = 0; y < height; y++)
    {
        for (let x = 0; x < width; x++)
        {
            const red = Math.round((255 / width) * x);
            const green = Math.round((255 / height) * y);
            const blue = Math.round((red + green) * 0.5);
            image.data[pixel_index + 0] = red;
            image.data[pixel_index + 1] = green;
            image.data[pixel_index + 2] = blue;
            image.data[pixel_index + 3] = 255;
            pixel_index += pixel_size;
        }
    }
    context.putImageData(image, 0, 0);
}