import { ColorConverter, IRoomRenderingCanvas, RoomPreviewer, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetNitroInstance } from '../../../api';

export interface RoomPreviewerViewProps
{
    roomPreviewer: RoomPreviewer;
    height?: number;
}

export const RoomPreviewerView: FC<RoomPreviewerViewProps> = props =>
{
    const { roomPreviewer = null, height = 0 } = props;
    const [ renderingCanvas, setRenderingCanvas ] = useState<IRoomRenderingCanvas>(null);
    const elementRef = useRef<HTMLDivElement>();

    const update = useCallback((time: number) =>
    {
        if(!roomPreviewer || !renderingCanvas || !elementRef.current) return;
        
        roomPreviewer.updatePreviewRoomView();

        if(!renderingCanvas.canvasUpdated) return;

        elementRef.current.style.backgroundImage = `url(${ TextureUtils.generateImageUrl(renderingCanvas.master) })`;
    }, [ roomPreviewer, renderingCanvas, elementRef ]);

    const setupPreviewer = useCallback(() =>
    {
        if(!elementRef.current || !roomPreviewer) return;

        const computed = document.defaultView.getComputedStyle(elementRef.current, null);

        let backgroundColor = computed.backgroundColor;

        backgroundColor = ColorConverter.rgbStringToHex(backgroundColor);
        backgroundColor = backgroundColor.replace('#', '0x');

        roomPreviewer.backgroundColor = parseInt(backgroundColor, 16);

        const width = elementRef.current.parentElement.clientWidth;
        
        roomPreviewer.getRoomCanvas(width, height);

        const canvas = roomPreviewer.getRenderingCanvas();

        setRenderingCanvas(canvas);

        canvas.canvasUpdated = true;

        update(-1);
    }, [ elementRef, height, roomPreviewer, update ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        if(!renderingCanvas) setupPreviewer();

        GetNitroInstance().ticker.add(update);

        const resizeObserver = new ResizeObserver(() =>
            {
                if(!roomPreviewer || !elementRef.current) return;

                const width = elementRef.current.parentElement.offsetWidth;

                roomPreviewer.modifyRoomCanvas(width, height);

                update(-1);
            });
        
        resizeObserver.observe(elementRef.current);

        return () =>
        {
            resizeObserver.disconnect();

            GetNitroInstance().ticker.remove(update);
        }

    }, [ renderingCanvas, roomPreviewer, elementRef, height, setupPreviewer, update ]);

    return (
        <div className="room-preview-container">
            <div ref={ elementRef } className="room-preview-image" style={ { height } } />
            { props.children }
        </div>
    );
}
