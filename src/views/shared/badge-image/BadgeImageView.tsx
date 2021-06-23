import { FC } from 'react';
import { GetConfiguration } from '../../../utils/GetConfiguration';
import { BadgeImageViewProps } from './BadgeImageView.types';

export const BadgeImageView: FC<BadgeImageViewProps> = props =>
{
    const { badgeCode = null, isGroup = false } = props;

    function getBadgeUrl(): string
    {
        if(isGroup)
        {
            return ((GetConfiguration<string>('badge.asset.group.url')).replace('%badgedata%', badgeCode));
        }
        else
        {
            return ((GetConfiguration<string>('badge.asset.url')).replace('%badgename%', badgeCode));
        }
    }

    const url = `url('${ getBadgeUrl() }')`;

    return <div className="badge-image" style={ (url && url.length) ? { backgroundImage: url } : {} }></div>;
}
