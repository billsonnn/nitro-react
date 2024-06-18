import { FC } from 'react';
import { BaseProps, LayoutBadgeImageView } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

interface CatalogAddOnBadgeWidgetViewProps extends BaseProps<HTMLDivElement>
{

}

export const CatalogAddOnBadgeWidgetView: FC<CatalogAddOnBadgeWidgetViewProps> = props =>
{
    const { ...rest } = props;
    const { currentOffer = null } = useCatalog();

    if(!currentOffer || !currentOffer.badgeCode || !currentOffer.badgeCode.length) return null;

    return <LayoutBadgeImageView badgeCode={ currentOffer.badgeCode } { ...rest } />;
};
