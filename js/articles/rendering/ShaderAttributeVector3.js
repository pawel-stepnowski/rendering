// @ts-check
import { Vector3, Matrix } from "./math/index.js";

/**
 * @implements {Articles.Rendering.IFragmentShaderAttribute<Articles.Rendering.Math.Vector3>}
 */
export class ShaderAttributeVector3
{
    createValue()
    {
        return Vector3.createZero();
    }

    /**
     * 
     * @param {Articles.Rendering.FixedArray<Articles.Rendering.Math.Vector3, 3>} values 
     * @param {Articles.Rendering.FixedArray<number, 3>} interpolation 
     * @param {Articles.Rendering.Math.Vector3} value
     */
    interpolate(values, interpolation, value)
    {
        Matrix.mulVector(values, interpolation, value);
    }
}