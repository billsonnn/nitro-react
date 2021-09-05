import { FC } from 'react';
import { GetConfiguration, LocalizeBadgeDescription, LocalizeBadgeName, LocalizeText } from '../../../api';
import { BadgeInformationView } from './badge-info/BadgeInformationView';
import { BadgeImageViewProps } from './BadgeImageView.types';

export const BadgeImageView: FC<BadgeImageViewProps> = props =>
{
    const { badgeCode = null, isGroup = false, showInfo = false, customTitle = null } = props;

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

    return <div className="badge-image" style={ (url && url.length) ? { backgroundImage: url } : {} }>
        { showInfo && <BadgeInformationView title={ isGroup ? customTitle : LocalizeBadgeName(badgeCode) } description={ isGroup ? LocalizeText('group.badgepopup.body') : LocalizeBadgeDescription(badgeCode) } /> }
    </div>;
}
