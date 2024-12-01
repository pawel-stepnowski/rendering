// @ts-check
import { BarycentricCoordinates } from "./math/BarycentricCoordinates.js";
import { Vector2 } from "./math/index.js";

export class TriangleTraversal
{
    /**
     * @param {ImageData} image_data 
     */
    constructor(image_data)
    {
        this.image_data = image_data;
        this.barycentric = new BarycentricCoordinates();
    }

    /**
     * @param {Articles.Rendering.Math.Triangle2} triangle 
     * @param {(pixel: Articles.Rendering.Math.Vector2, interpolation: Articles.Rendering.Math.Vector3) => Articles.Rendering.Math.Vector4} callback 
     */
    traverse(triangle, callback)
    {
        const { width, data } = this.image_data;
        const [[ax, ay], [bx, by], [cx, cy]] = triangle;
        const x_max = Math.ceil(Math.max(ax, bx, cx));
        const x_min = Math.floor(Math.min(ax, bx, cx));
        const y_max = Math.ceil(Math.max(ay, by, cy));
        const y_min = Math.floor(Math.min(ay, by, cy));
        this.barycentric.triangle = triangle;

        for (let y = y_min; y <= y_max; y++)
        {
            for (let x = x_min; x <= x_max; x++)
            {
                const p = Vector2.createFromValues([x, y]);
                const [u, v] = this.barycentric.convert(p);
                if (BarycentricCoordinates.isUvInside([u, v]))
                {
                    const i = (y * width + x) * 4;
                    const color = callback([x, y], [u, v, 1 - u - v]);
                    data[i + 0] = color[0] * 255;
                    data[i + 1] = color[1] * 255;
                    data[i + 2] = color[2] * 255;
                    data[i + 3] = 255;
                }
            }
        }
    }
}