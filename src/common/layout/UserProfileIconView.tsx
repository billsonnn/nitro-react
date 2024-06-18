import { FC, useMemo } from 'react';
import { GetUserProfile } from '../../api';
import { Base, BaseProps } from '../Base';

export interface UserProfileIconViewProps extends BaseProps<HTMLDivElement>
{
    userId?: number;
    userName?: string;
}

export const UserProfileIconView: FC<UserProfileIconViewProps> = props =>
{
    const { userId = 0, userName = null, classNames = [], pointer = true, children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'bg-[url("@/assets/images/friends/friends-spritesheet.png")]', 'w-[13px] h-[11px] bg-[-51px_-91px]' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    return (
        <Base classNames={ getClassNames } pointer={ pointer } onClick={ event => GetUserProfile(userId) } { ...rest }>
            { children }
        </Base>
    );
};
