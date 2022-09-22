import { NitroToolbarAnimateIconEvent, TextureUtils, ToolbarIconEnum } from '@nitrots/nitro-renderer';
import { FC, useRef } from 'react';
import { GetRoomEngine } from '../../../../api';
import { LayoutRoomPreviewerView, LayoutRoomPreviewerViewProps } from '../../../../common';
import { CatalogPurchasedEvent } from '../../../../events';
import { useUiEvent } from '../../../../hooks';

export const CatalogRoomPreviewerView: FC<LayoutRoomPreviewerViewProps> = props =>
{
    const { roomPreviewer = null } = props;
    const elementRef = useRef<HTMLDivElement>(null);

    useUiEvent(CatalogPurchasedEvent.PURCHASE_SUCCESS, event =>
    {
        if(!elementRef) return;
        
        const renderTexture = roomPreviewer.getRoomObjectCurrentImage();

        if(!renderTexture) return;

        const image = TextureUtils.generateImage(renderTexture);

        if(!image) return;

        const bounds = elementRef.current.getBoundingClientRect();

        const x = (bounds.x + (bounds.width / 2));
        const y = (bounds.y + (bounds.height / 2));

        const animateEvent = new NitroToolbarAnimateIconEvent(image, x, y);

        animateEvent.iconName = ToolbarIconEnum.INVENTORY;

        GetRoomEngine().events.dispatchEvent(animateEvent);
    });

    return (
        <div ref={ elementRef }>
            <LayoutRoomPreviewerView { ...props } />
        </div>
    );
}
