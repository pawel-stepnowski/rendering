// @ts-check
import { Matrix, ONE_DEGREE_IN_RADIANS } from "./index.js";

export class Matrix3
{
    /**
     * @param {number} degrees 
     * @returns {Articles.Rendering.Math.MatrixN<3>}
     */
    static createRotation(degrees)
    {
        const sin = Math.sin(degrees * ONE_DEGREE_IN_RADIANS);
        const cos = Math.cos(degrees * ONE_DEGREE_IN_RADIANS);
        return Matrix.createFromValues
        ([
            [cos, -sin, 0],
            [sin,  cos, 0],
            [  0,    0, 1]
        ]);
    }

    /**
     * @param {[number, number]} t
     * @returns {Articles.Rendering.Math.MatrixN<3>}
     */
    static createTranslation([tx, ty])
    {
        return Matrix.createFromValues
        ([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0,  1]
        ]);
    }
}
