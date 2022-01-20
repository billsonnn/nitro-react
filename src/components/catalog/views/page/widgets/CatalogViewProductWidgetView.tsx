import { IObjectData } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { CatalogSelectProductEvent } from '../../../../../events';
import { CatalogSetRoomPreviewerStuffDataEvent } from '../../../../../events/catalog/CatalogSetRoomPreviewerStuffDataEvent';
import { CatalogWidgetEvent } from '../../../../../events/catalog/CatalogWidgetEvent';
import { BatchUpdates, useUiEvent } from '../../../../../hooks';
import { IPurchasableOffer } from '../../../common/IPurchasableOffer';
import { useCatalogContext } from '../../../context/CatalogContext';

export const CatalogViewProductWidgetView: FC<{}> = props =>
{
    const [ selectedProductEvent, setSelectedProductEvent ] = useState<CatalogSelectProductEvent>(null);
    const [ offer, setOffer ] = useState<IPurchasableOffer>(null);
    const [ stuffData, setStuffData ] = useState<IObjectData>(null);
    const { roomPreviewer = null } = useCatalogContext();

    const onCatalogSelectProductEvent = useCallback((event: CatalogSelectProductEvent) =>
    {
        BatchUpdates(() =>
        {
            setSelectedProductEvent(event);
            setOffer(event.offer);
        })
    }, []);

    useUiEvent(CatalogWidgetEvent.SELECT_PRODUCT, onCatalogSelectProductEvent);

    const onCatalogSetRoomPreviewerStuffDataEvent = useCallback((event: CatalogSetRoomPreviewerStuffDataEvent) =>
    {
        setStuffData(event.stuffData);

        if(roomPreviewer) roomPreviewer.reset(false);
    }, [ roomPreviewer ]);

    useUiEvent(CatalogWidgetEvent.SET_PREVIEWER_STUFFDATA, onCatalogSetRoomPreviewerStuffDataEvent);

    return null;
}
