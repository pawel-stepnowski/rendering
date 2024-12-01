// @ts-check
import { Vector } from "./Vector.js";
import { Vector2 } from "./Vector2.js";

/**
 * @implements {Articles.Rendering.Math.IBarycentricCoordinatesConverter}
 */
export class BarycentricCoordinates
{
    /**
     * @param {[number, number]} param0
     */
    static isUvInside([u, v])
    {
        return (u >= 0) && (v >= 0) && (u + v < 1);
    }

    constructor()
    {
        /** @type {Articles.Rendering.Math.Triangle2} */
        this._triangle = [[0, 0], [0, 0], [0, 0]];
        this._c_a = Vector2.createFromValues([0, 0]);
        this._b_a = Vector2.createFromValues([0, 0]);
        this._cc = 0;
        this._bc = 0;
        this._bb = 0;
        this._denom = 0;
    }

    /**
     * @param {Articles.Rendering.Math.Triangle2} value 
     */
    set triangle(value)
    {
        this._triangle = value;
        const [a, b, c] = value;
        const c_a = Vector2.sub(c, a);
        const b_a = Vector2.sub(b, a);
        const cc = Vector.dot(c_a, c_a);
        const bc = Vector.dot(b_a, c_a);
        const bb = Vector.dot(b_a, b_a);
        const denom = cc * bb - bc * bc;
        this._c_a = c_a;
        this._b_a = b_a;
        this._cc = cc;
        this._bc = bc;
        this._bb = bb;
        this._denom = denom;
    }

    /**
     * @param {Articles.Rendering.Math.Vector2} p 
     */
    convert(p)
    {
        const [a] = this._triangle;
        const { _b_a: b_a ,_c_a: c_a ,_bb: bb, _bc: bc, _cc: cc, _denom: denom } = this;
        const p_a = Vector2.sub(p, a);
        const pc = Vector.dot(c_a, p_a);
        const pb = Vector.dot(b_a, p_a);
        const u = (bb * pc - bc * pb) / denom;
        const v = (cc * pb - bc * pc) / denom;
        return Vector2.createFromValues([u, v]);
    }
}