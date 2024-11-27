// @ts-check
import { FixedArray } from "../FixedArray.js";
import { Vector } from "./Vector.js";

export class Matrix
{
    /**
     * @template {number} M
     * @template {number} N
     * @param {M} m 
     * @param {N} n 
     * @param {(i: number, j: number) => number} initializer
     * @returns {Articles.Rendering.Math.Matrix<M, N>}
     */
    static create(m, n, initializer)
    {
        return FixedArray.create(n, j => FixedArray.create(m, i => initializer(i, j)));
    }
    
    /**
     * @template {number} M
     * @template {number} N
     * @param {M} m 
     * @param {N} n 
     * @returns {Articles.Rendering.Math.Matrix<M, N>}
     */
    static createZero(m, n)
    {
        return FixedArray.create(n, () => FixedArray.createZero(m));
    }

    /**
     * @template {number} M
     * @template {number} N
     * @param {Articles.Rendering.Math.Matrix<M, N>} values 
     * @returns {Articles.Rendering.Math.Matrix<M, N>}
     */
    static createFromValues(values)
    {
        return values;
    }

    /**
     * @template {number} M
     * @template {number} N
     * @param {Articles.Rendering.Math.Matrix<M, N>} a
     * @param {Articles.Rendering.Math.Vector<M>} v
     * @param {Articles.Rendering.Math.Vector<N>} [result]
     * @returns {Articles.Rendering.Math.Vector<N>}
     */
    static mulVector(a, v, result)
    {
        const n = a.length;
        const m = v.length;
        if (result) result.fill(0); 
        else result = Vector.createZero(n);
        for (let i = 0; i < n; i++) 
            for (let j = 0; j < m; j++)
                result[i] += a[i][j] * v[j];
        return result;
    }

    /**
     * @template {number} M
     * @template {number} N
     * @template {number} P
     * @param {Articles.Rendering.Math.Matrix<M, N>} a
     * @param {Articles.Rendering.Math.Matrix<N, P>} b
     * @param {Articles.Rendering.Math.Matrix<M, P>} [result]
     * @returns {Articles.Rendering.Math.Matrix<M, P>}
     */
    static mul(a, b, result)
    {
        const M = a[0].length;
        const N = a.length;
        const P = b.length;
        if (result) result.forEach(column => column.fill(0)); 
        else result = Matrix.createZero(M, P);
        for (let m = 0; m < M; m++)
            for (let p = 0; p < P; p++)
                for (let n = 0; n < N; n++)
                    result[m][p] += a[m][n] * b[n][p];
        return result;
    }
}