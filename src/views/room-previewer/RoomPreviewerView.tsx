import { ColorConverter, IRoomRenderingCanvas, Nitro } from 'nitro-renderer';
import { createRef, FC, useCallback, useEffect, useState } from 'react';
import { RoomPreviewerViewProps } from './RoomPreviewerView.types';

export const RoomPreviewerView: FC<RoomPreviewerViewProps> = props =>
{
    const { roomPreviewer = null, height = 0 } = props;

    const [ renderingCanvas, setRenderingCanvas ] = useState<IRoomRenderingCanvas>(null);

    const elementRef = createRef<HTMLDivElement>();

    const update = useCallback((time: number) =>
    {
        if(!roomPreviewer || !renderingCanvas || !elementRef || !elementRef.current) return;
        
        roomPreviewer.updatePreviewRoomView();

        if(!renderingCanvas.canvasUpdated) return;

        elementRef.current.style.backgroundImage = `url(${ Nitro.instance.renderer.extract.base64(renderingCanvas.master) })`

    }, [ roomPreviewer, renderingCanvas, elementRef ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        const computed = document.defaultView.getComputedStyle(elementRef.current, null);

        const width = parseInt(computed.width.replace('px', ''));

        let backgroundColor = computed.backgroundColor;
        
        backgroundColor = ColorConverter.rgbStringToHex(backgroundColor);
        backgroundColor = backgroundColor.replace('#', '0x');

        roomPreviewer.backgroundColor = parseInt(backgroundColor, 16);

        const displayObject = roomPreviewer.getRoomCanvas(width, height);
        const renderingCanvas = roomPreviewer.getRenderingCanvas();

        elementRef.current.style.width = `${ width }px`;
        elementRef.current.style.height = `${ height }px`;

        setRenderingCanvas(renderingCanvas);

        renderingCanvas.canvasUpdated = true;

        Nitro.instance.ticker.add(update);

        return () =>
        {
            Nitro.instance.ticker.remove(update);
        }

    }, [ roomPreviewer, height, elementRef, update ]);

    return <div ref={ elementRef } className="room-preview-image" />
}
