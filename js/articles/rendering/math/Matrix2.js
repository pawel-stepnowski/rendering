// @ts-check
import { FixedArray } from "../../FixedArray.js";
import { Matrix, Vector, ONE_DEGREE_IN_RADIANS } from "./index.js";

export class Matrix2
{
    /**
     * @param {number} degrees 
     * @returns {Articles.Rendering.Math.MatrixN<2>}
     */
    static createRotation(degrees)
    {
        const sin = Math.sin(degrees * ONE_DEGREE_IN_RADIANS);
        const cos = Math.cos(degrees * ONE_DEGREE_IN_RADIANS);
        return Matrix.createFromValues
        ([
            [cos, -sin],
            [sin,  cos]
        ]);
    }
}
