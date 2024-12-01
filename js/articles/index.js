// @ts-check

/**
 * @template {{}} T
 * @param {T} a 
 * @returns {(keyof T)[]}
 */
export function keysOf(a)
{
    // @ts-ignore
    return Object.keys(a);
}
