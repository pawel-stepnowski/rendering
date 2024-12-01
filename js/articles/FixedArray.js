// @ts-check

export class FixedArray
{
    /**
     * @template T
     * @template {number} N
     * @param {N} length 
     * @param {(i: number) => T} initializer
     * @returns {Articles.Rendering.FixedArray<T, N>}
     */
    static create(length, initializer)
    {
        // @ts-ignore
        return Array.from({ length }, (_, i) => initializer(i));
    }

    /**
     * @template T
     * @template {number} N
     * @param {Articles.Rendering.FixedArray<T, N>} values 
     * @returns {Articles.Rendering.FixedArray<T, N>}
     */
    static createFromValues(values)
    {
        return values;
    }

    /**
     * @template T
     * @template {number} N
     * @param {N} length 
     * @returns {Articles.Rendering.FixedArray<T, N>}
     */
    static createZero(length)
    {
        const array = Array.from({ length });
        array.fill(0);
        // @ts-ignore
        return array;
    }

    /**
     * @template TSource
     * @template TTarget
     * @template {number} N
     * @param {Articles.Rendering.FixedArray<TSource, N>} array 
     * @param {(value: TSource, index: number) => TTarget} map_function 
     * @returns {Articles.Rendering.FixedArray<TTarget, N>}
     */
    static map(array, map_function)
    {
        return FixedArray.create(array.length, i => map_function(array[i], i));
    }
}