import { FC, useCallback, useState } from 'react';
import { BaseProps } from '../../../../../common/Base';
import { CatalogSelectProductEvent } from '../../../../../events';
import { useUiEvent } from '../../../../../hooks';
import { BadgeImageView } from '../../../../../views/shared/badge-image/BadgeImageView';

interface CatalogAddOnBadgeWidgetViewProps extends BaseProps<HTMLDivElement>
{

}

export const CatalogAddOnBadgeWidgetView: FC<CatalogAddOnBadgeWidgetViewProps> = props =>
{
    const { ...rest } = props;
    const [ badgeCode, setBadgeCode ] = useState<string>(null);

    const onCatalogSelectProductEvent = useCallback((event: CatalogSelectProductEvent) =>
    {
        if(event.offer.badgeCode) setBadgeCode(event.offer.badgeCode);
    }, []);

    useUiEvent(CatalogSelectProductEvent.SELECT_PRODUCT, onCatalogSelectProductEvent);

    if(!badgeCode || !badgeCode.length) return null;

    return <BadgeImageView badgeCode={ badgeCode } { ...rest } />;
}
