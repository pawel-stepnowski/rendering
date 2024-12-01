// @ts-check
import { FixedArray } from "../../FixedArray.js";
import { Matrix } from "./Matrix.js";

export class Vector
{
    /**
     * @template {number} N
     * @param {N} n
     * @returns {Articles.Rendering.Math.Vector<N>}
     */
    static createZero(n)
    {
        return FixedArray.createZero(n);
    }

    /**
     * @template {number} N
     * @param {Articles.Rendering.Math.Vector<N>} a
     * @param {Articles.Rendering.Math.Vector<N>} b 
     * @returns {number}
     */
    static dot(a, b)
    {
        const n = a.length;
        let result = 0;
        for (let i = 0; i < n; i++) result += a[i] * b[i];
        return result;
    }

    /**
     * @template {number} N
     * @param {Articles.Rendering.Math.Vector<N>[]} vs
     * @param {Articles.Rendering.Math.Vector<N>} [result]
     * @returns {Articles.Rendering.Math.Vector<N>}
     */
    static sum(vs, result)
    {
        const n = vs[0].length;
        if (result) result.fill(0); 
        else result = Vector.createZero(n);
        vs.forEach(v => v.forEach((v, i) => result[i] += v));
        return result;
    }

    /**
     * @template {number} N
     * @param {Articles.Rendering.Math.Vector<N>} v
     * @param {number} c
     * @param {Articles.Rendering.Math.Vector<N>} [result]
     * @returns {Articles.Rendering.Math.Vector<N>}
     */
    static mul(v, c, result)
    {
        const n = v.length;
        if (!result) result = Vector.createZero(n);
        v.forEach((x, i) => result[i] = x * c);
        return result;
    }
}