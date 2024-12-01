// @ts-check

export class Vector3
{
    /**
     * @param {[number, number, number]} values 
     * @returns {Articles.Rendering.Math.Vector3}
     */
    static createFromValues(values)
    {
        // @ts-ignore
        return values;
    }

    /**
     * @returns {Articles.Rendering.Math.Vector3}
     */
    static createZero()
    {
        return [0, 0, 0];
    }
}