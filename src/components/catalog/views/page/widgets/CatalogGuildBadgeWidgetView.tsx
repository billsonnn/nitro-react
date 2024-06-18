import { StringDataType } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { BaseProps, LayoutBadgeImageView } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';

interface CatalogGuildBadgeWidgetViewProps extends BaseProps<HTMLDivElement>
{

}

export const CatalogGuildBadgeWidgetView: FC<CatalogGuildBadgeWidgetViewProps> = props =>
{
    const { ...rest } = props;
    const { currentOffer = null, purchaseOptions = null } = useCatalog();
    const { previewStuffData = null } = purchaseOptions;

    const badgeCode = useMemo(() =>
    {
        if(!currentOffer || !previewStuffData) return null;

        const badgeCode = (previewStuffData as StringDataType).getValue(2);

        if(!badgeCode || !badgeCode.length) return null;

        return badgeCode;
    }, [ currentOffer, previewStuffData ]);

    if(!badgeCode) return null;

    return <LayoutBadgeImageView badgeCode={ badgeCode } isGroup={ true } { ...rest } />;
};
