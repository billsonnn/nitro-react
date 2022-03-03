import { StringDataType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AutoGrid, AutoGridProps, LayoutBadgeImageView, LayoutGridItem } from '../../../../../common';
import { InventoryBadgesRequestEvent, InventoryBadgesUpdatedEvent } from '../../../../../events';
import { DispatchUiEvent, UseUiEvent } from '../../../../../hooks';
import { useCatalogContext } from '../../../CatalogContext';

const EXCLUDED_BADGE_CODES: string[] = [];

interface CatalogBadgeSelectorWidgetViewProps extends AutoGridProps
{

}

export const CatalogBadgeSelectorWidgetView: FC<CatalogBadgeSelectorWidgetViewProps> = props =>
{
    const { columnCount = 5, ...rest } = props;
    const [ badges, setBadges ] = useState<string[]>([]);
    const [ currentBadge, setCurrentBadge ] = useState<string>(null);
    const { currentOffer = null, setPurchaseOptions = null } = useCatalogContext();

    const onInventoryBadgesUpdatedEvent = useCallback((event: InventoryBadgesUpdatedEvent) =>
    {
        setBadges(event.badges);
    }, []);

    UseUiEvent(InventoryBadgesUpdatedEvent.BADGES_UPDATED, onInventoryBadgesUpdatedEvent);

    const previewStuffData = useMemo(() =>
    {
        if(!currentBadge) return null;

        const stuffData = new StringDataType();

        stuffData.setValue([ '0', currentBadge, '', '' ]);

        return stuffData;
    }, [ currentBadge ]);

    useEffect(() =>
    {
        if(!currentOffer) return;

        setPurchaseOptions(prevValue =>
            {
                const extraParamRequired = true;
                const extraData = ((previewStuffData && previewStuffData.getValue(1)) || null);

                return { ...prevValue, extraParamRequired, extraData, previewStuffData };
            });
    }, [ currentOffer, previewStuffData, setPurchaseOptions ]);

    useEffect(() =>
    {
        DispatchUiEvent(new InventoryBadgesRequestEvent(InventoryBadgesRequestEvent.REQUEST_BADGES));
    }, []);

    return (
        <AutoGrid columnCount={ columnCount } { ...rest }>
            { badges && (badges.length > 0) && badges.map(code =>
                {
                    return (
                        <LayoutGridItem key={ code } itemActive={ (currentBadge === code) } onClick={ event => setCurrentBadge(code) }> 
                            <LayoutBadgeImageView badgeCode={ code } />
                        </LayoutGridItem>
                    );
                }) }
        </AutoGrid>
    );
}
