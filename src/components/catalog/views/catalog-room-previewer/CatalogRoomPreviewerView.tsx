import { NitroToolbarAnimateIconEvent, TextureUtils, ToolbarIconEnum } from '@nitrots/nitro-renderer';
import { FC, useCallback, useRef } from 'react';
import { GetRoomEngine } from '../../../../api';
import { CatalogEvent } from '../../../../events';
import { useUiEvent } from '../../../../hooks';
import { RoomPreviewerView } from '../../../../views/shared/room-previewer/RoomPreviewerView';
import { RoomPreviewerViewProps } from '../../../../views/shared/room-previewer/RoomPreviewerView.types';

export const CatalogRoomPreviewerView: FC<RoomPreviewerViewProps> = props =>
{
    const { roomPreviewer = null } = props;
    const elementRef = useRef<HTMLDivElement>(null);

    const animatePurchase = useCallback(() =>
    {
        if(!elementRef) return;
        
        const renderTexture = roomPreviewer.getRoomObjectCurrentImage();

        if(!renderTexture) return;

        const image = TextureUtils.generateImage(renderTexture);

        if(!image) return;

        const bounds = elementRef.current.getBoundingClientRect();

        const x = (bounds.x + (bounds.width / 2));
        const y = (bounds.y + (bounds.height / 2));

        const event = new NitroToolbarAnimateIconEvent(image, x, y);

        event.iconName = ToolbarIconEnum.INVENTORY;

        GetRoomEngine().events.dispatchEvent(event);
    }, [ roomPreviewer ]);
    
    const onCatalogEvent = useCallback((event: CatalogEvent) =>
    {
        switch(event.type)
        {
            case CatalogEvent.PURCHASE_SUCCESS:
                animatePurchase();
                return;
        }
    }, [ animatePurchase ]);

    useUiEvent(CatalogEvent.PURCHASE_SUCCESS, onCatalogEvent);

    return (
        <div ref={ elementRef }>
            <RoomPreviewerView { ...props } />
        </div>
    );
}