import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, forwardRef } from 'react';
import { classNames } from '../../layout';

type AvatarIconType = 'male' | 'female' | 'clear' | 'sellable';

export const AvatarEditorIcon = forwardRef<HTMLDivElement, PropsWithChildren<{
    icon: AvatarIconType;
    selected?: boolean;
}> & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>((props, ref) =>
{
    const { icon = null, selected = false, className = null, ...rest } = props;

    /*
    switch (icon)
    {
        case 'male':


            break;

        case 'arrow-left':

            break;

        default:
            //statements; 
            break;

    }
*/
    return (
        <div
            ref={ ref }

            className={ classNames(
                'nitro-avatar-editor-spritesheet',
                'cursor-pointer',
                `${ icon }-icon`,
                selected && 'selected',
                className
            ) }
            { ...rest } />
    );
});

AvatarEditorIcon.displayName = 'AvatarEditorIcon';
