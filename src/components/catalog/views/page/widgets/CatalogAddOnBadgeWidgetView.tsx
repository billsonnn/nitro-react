import { FC } from 'react';
import { BaseProps } from '../../../../../common/Base';
import { BadgeImageView } from '../../../../../views/shared/badge-image/BadgeImageView';
import { useCatalogContext } from '../../../CatalogContext';

interface CatalogAddOnBadgeWidgetViewProps extends BaseProps<HTMLDivElement>
{

}

export const CatalogAddOnBadgeWidgetView: FC<CatalogAddOnBadgeWidgetViewProps> = props =>
{
    const { ...rest } = props;
    const { currentOffer = null } = useCatalogContext();

    if(!currentOffer || !currentOffer.badgeCode || !currentOffer.badgeCode.length) return null;

    return <BadgeImageView badgeCode={ currentOffer.badgeCode } { ...rest } />;
}
