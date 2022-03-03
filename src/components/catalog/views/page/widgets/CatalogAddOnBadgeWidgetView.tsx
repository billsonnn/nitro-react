import { FC } from 'react';
import { BaseProps, LayoutBadgeImageView } from '../../../../../common';
import { useCatalogContext } from '../../../CatalogContext';

interface CatalogAddOnBadgeWidgetViewProps extends BaseProps<HTMLDivElement>
{

}

export const CatalogAddOnBadgeWidgetView: FC<CatalogAddOnBadgeWidgetViewProps> = props =>
{
    const { ...rest } = props;
    const { currentOffer = null } = useCatalogContext();

    if(!currentOffer || !currentOffer.badgeCode || !currentOffer.badgeCode.length) return null;

    return <LayoutBadgeImageView badgeCode={ currentOffer.badgeCode } { ...rest } />;
}
