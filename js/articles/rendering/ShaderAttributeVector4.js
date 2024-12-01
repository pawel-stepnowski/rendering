// @ts-check
import { Vector4, Matrix } from "./math/index.js";

/**
 * @implements {Articles.Rendering.IFragmentShaderAttribute<Articles.Rendering.Math.Vector4>}
 */
export class ShaderAttributeVector4
{
    createValue()
    {
        return Vector4.createZero();
    }

    /**
     * 
     * @param {Articles.Rendering.FixedArray<Articles.Rendering.Math.Vector4, 3>} values 
     * @param {Articles.Rendering.FixedArray<number, 3>} interpolation 
     * @param {Articles.Rendering.Math.Vector4} value
     */
    interpolate(values, interpolation, value)
    {
        Matrix.mulVector(values, interpolation, value);
    }
}