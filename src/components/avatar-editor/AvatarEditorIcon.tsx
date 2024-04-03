import { FC, useMemo } from 'react';
import { Base, BaseProps } from '../../common';

type AvatarIconType = 'male' | 'female' | 'clear' | 'sellable' | string;

export const AvatarEditorIcon: FC<{
    icon: AvatarIconType;
    selected?: boolean;
} & BaseProps<HTMLDivElement>> = props =>
{
    const { icon = null, selected = false, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'nitro-avatar-editor-spritesheet' ];

        if(icon && icon.length) newClassNames.push(icon + '-icon');

        if(selected) newClassNames.push('selected');

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ icon, selected, classNames ]);

    return <Base classNames={ getClassNames } { ...rest } />
}
