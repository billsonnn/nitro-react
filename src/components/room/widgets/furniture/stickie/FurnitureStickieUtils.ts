export const STICKIE_COLORS = ['9CCEFF','FF9CFF', '9CFF9C','FFFF33'];
export const STICKIE_COLOR_NAMES = [ 'blue', 'pink', 'green', 'yellow' ];

export function getStickieColorName(color: string): string
{
    let index = STICKIE_COLORS.indexOf(color);

    if(index === -1) index = 0;

    return STICKIE_COLOR_NAMES[index];
}
