import { StringDataType } from '@nitrots/nitro-renderer';
import { FC, useMemo } from 'react';
import { BaseProps } from '../../../../../common/Base';
import { BadgeImageView } from '../../../../../views/shared/badge-image/BadgeImageView';
import { useCatalogContext } from '../../../CatalogContext';

interface CatalogGuildBadgeWidgetViewProps extends BaseProps<HTMLDivElement>
{

}

export const CatalogGuildBadgeWidgetView: FC<CatalogGuildBadgeWidgetViewProps> = props =>
{
    const { ...rest } = props;
    const { currentOffer = null, purchaseOptions = null } = useCatalogContext();
    const { previewStuffData = null } = purchaseOptions;

    const badgeCode = useMemo(() =>
    {
        if(!currentOffer || !previewStuffData) return null;

        const badgeCode = (previewStuffData as StringDataType).getValue(2);

        if(!badgeCode || !badgeCode.length) return null;

        return badgeCode;
    }, [ currentOffer, previewStuffData ]);

    if(!badgeCode) return null;

    return <BadgeImageView badgeCode={ badgeCode } isGroup={ true } { ...rest } />;
}
