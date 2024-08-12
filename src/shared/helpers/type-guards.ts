export function isInputTag(el?: HTMLElement): el is HTMLInputElement {
    return el?.tagName === 'INPUT';
}
