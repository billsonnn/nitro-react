export const DoElementsOverlap = (a: HTMLElement, b: HTMLElement) =>
{
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    
    const ox = Math.abs(rectA.x - rectB.x) < (rectA.x < rectB.x ? rectB.width : rectA.width);
    const oy = Math.abs(rectA.y - rectB.y) < (rectA.y < rectB.y ? rectB.height : rectA.height);
    
    return (ox && oy);
}
