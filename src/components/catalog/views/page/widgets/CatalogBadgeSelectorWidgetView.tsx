import { StringDataType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { IBadgeItem } from '../../../../../api';
import { AutoGrid, AutoGridProps, LayoutBadgeImageView, LayoutGridItem } from '../../../../../common';
import { useSharedInventoryBadges } from '../../../../../hooks';
import { useCatalogContext } from '../../../CatalogContext';

const EXCLUDED_BADGE_CODES: string[] = [];

interface CatalogBadgeSelectorWidgetViewProps extends AutoGridProps
{

}

export const CatalogBadgeSelectorWidgetView: FC<CatalogBadgeSelectorWidgetViewProps> = props =>
{
    const { columnCount = 5, ...rest } = props;
    const [ currentBadge, setCurrentBadge ] = useState<IBadgeItem>(null);
    const { currentOffer = null, setPurchaseOptions = null } = useCatalogContext();
    const { badges = [] } = useSharedInventoryBadges();

    const previewStuffData = useMemo(() =>
    {
        if(!currentBadge) return null;

        const stuffData = new StringDataType();

        stuffData.setValue([ '0', currentBadge.badgeCode, '', '' ]);

        return stuffData;
    }, [ currentBadge ]);

    useEffect(() =>
    {
        if(!currentOffer) return;

        setPurchaseOptions(prevValue =>
            {
                const newValue = { ...prevValue };

                newValue.extraParamRequired = true;
                newValue.extraData = ((previewStuffData && previewStuffData.getValue(1)) || null);
                newValue.previewStuffData = previewStuffData;

                return newValue;
            });
    }, [ currentOffer, previewStuffData, setPurchaseOptions ]);

    return (
        <AutoGrid columnCount={ columnCount } { ...rest }>
            { badges && (badges.length > 0) && badges.map((badge, index) =>
                {
                    return (
                        <LayoutGridItem key={ index } itemActive={ (currentBadge === badge) } onClick={ event => setCurrentBadge(badge) }> 
                            <LayoutBadgeImageView badgeCode={ badge.badgeCode } />
                        </LayoutGridItem>
                    );
                }) }
        </AutoGrid>
    );
}
