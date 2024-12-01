// @ts-check

/**
 * @param {Element} element 
 */
export function calculatePlaceholder(element)
{
    const size = Math.floor(element.clientHeight / parseFloat(getComputedStyle(element).fontSize));
    return { id: element.id, size }
}

export function calculatePlaceholders()
{
    const placeholders = [...document.querySelectorAll('.content-generated-from-code')].filter(e => e.id).map(calculatePlaceholder);
    const entries = new Map();
    placeholders.forEach(({ id, size }) => entries.set(id, size));
    return Object.fromEntries(entries);
}