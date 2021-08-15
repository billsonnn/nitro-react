import { ColorConverter, IRoomRenderingCanvas, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetNitroInstance } from '../../../api';
import { RoomPreviewerViewProps } from './RoomPreviewerView.types';

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

        elementRef.current.style.width = `${ width }px`;
        elementRef.current.style.height = `${ height }px`;

        setRenderingCanvas(canvas);

        canvas.canvasUpdated = true;

        update(-1);
    }, [ elementRef, height, roomPreviewer, update ]);

    useEffect(() =>
    {
        if(!roomPreviewer) return;

        if(!renderingCanvas) setupPreviewer();

        GetNitroInstance().ticker.add(update);

        function resize(): void
        {
            if(!roomPreviewer) return;

            const width = elementRef.current.parentElement.offsetWidth;

            elementRef.current.style.width = `${ width }px`;
            elementRef.current.style.height = `${ height }px`;

            roomPreviewer.modifyRoomCanvas(width, height);

            update(-1);
        }

        window.addEventListener('resize', resize);

        return () =>
        {
            GetNitroInstance().ticker.remove(update);

            window.removeEventListener('resize', resize);
        }

    }, [ renderingCanvas, roomPreviewer, elementRef, height, setupPreviewer, update ]);

    return (
        <div className="room-preview-container">
            <div ref={ elementRef } className="room-preview-image" />
            { props.children }
        </div>
    );
}
