export const transitionTypes = {
    entering: { opacity: 1 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
};

export function getTransitionStyle(type: string, timeout: number = 300): Partial<CSSStyleDeclaration>
{
    switch(type)
    {
        case 'ease-in-out':
            return {
                transition: `opacity ${ timeout }ms ease-in-out`,
                opacity: '0'
            }
    }
}
