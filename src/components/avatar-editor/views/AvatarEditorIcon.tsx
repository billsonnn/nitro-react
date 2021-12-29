import { FC, useMemo } from 'react';
import { Base, BaseProps } from '../../../common/Base';

type AvatarIconType = 'male' | 'female' | 'clear' | 'sellable' | string;

export interface AvatarEditorIconProps extends BaseProps<HTMLDivElement>
{
    icon: AvatarIconType;
    selected?: boolean;
}

export const AvatarEditorIcon: FC<AvatarEditorIconProps> = props =>
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
