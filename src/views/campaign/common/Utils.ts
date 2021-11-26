export const getNumItemsDisplayed = (): number =>
{
    return Math.max(Math.min(2, window.screen.width / 135), 7);
}
