export const getNumItemsDisplayed = (): number =>
{
    return Math.min(Math.max(2, Math.floor(window.screen.width / 135) - 3), 7);
}
