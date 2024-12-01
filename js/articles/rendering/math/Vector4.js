// @ts-check

export class Vector4
{
    /**
     * @param {[number, number, number, number]} values 
     * @returns {Articles.Rendering.Math.Vector4}
     */
    static createFromValues(values)
    {
        // @ts-ignore
        return values;
    }

    /**
     * @returns {Articles.Rendering.Math.Vector4}
     */
    static createZero()
    {
        return [0, 0, 0, 0];
    }
}