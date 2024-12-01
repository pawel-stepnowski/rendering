// @ts-check

export class Vector2
{
    /**
     * @param {[number, number]} values 
     * @returns {Articles.Rendering.Math.Vector2}
     */
    static createFromValues(values)
    {
        // @ts-ignore
        return values;
    }

    /**
     * @param {Articles.Rendering.Math.Vector2} a
     * @param {Articles.Rendering.Math.Vector2} b 
     * @returns {Articles.Rendering.Math.Vector2}
     */
    static sub([ax, ay], [bx, by])
    {
        return Vector2.createFromValues([ax - bx, ay - by]);
    }
}