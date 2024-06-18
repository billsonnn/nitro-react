import { GetRenderer, GetTicker, NitroTicker, RoomPreviewer, TextureUtils } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useEffect, useRef } from 'react';

export const LayoutRoomPreviewerView: FC<{
    roomPreviewer: RoomPreviewer;
    height?: number;
}> = props =>
{
    const { roomPreviewer = null, height = 0 } = props;
    const elementRef = useRef<HTMLDivElement>();

    const onClick = (event: MouseEvent<HTMLDivElement>) =>
    {
        if(!roomPreviewer) return;

        if(event.shiftKey) roomPreviewer.changeRoomObjectDirection();
        else roomPreviewer.changeRoomObjectState();
    };

    useEffect(() =>
    {
        if(!elementRef) return;

        const width = elementRef.current.parentElement.clientWidth;
        const texture = TextureUtils.createRenderTexture(width, height);

        const update = async (ticker: NitroTicker) =>
        {
            if(!roomPreviewer || !elementRef.current) return;

            roomPreviewer.updatePreviewRoomView();

            const renderingCanvas = roomPreviewer.getRenderingCanvas();

            if(!renderingCanvas.canvasUpdated) return;

            GetRenderer().render({
                target: texture,
                container: renderingCanvas.master,
                clear: true
            });

            let canvas = GetRenderer().texture.generateCanvas(texture);
            const base64 = canvas.toDataURL('image/png');

            canvas = null;

            elementRef.current.style.backgroundImage = `url(${ base64 })`;
        };

        GetTicker().add(update);

        const resizeObserver = new ResizeObserver(() =>
        {
            if(!roomPreviewer || !elementRef.current) return;

            const width = elementRef.current.parentElement.offsetWidth;

            roomPreviewer.modifyRoomCanvas(width, height);

            update(GetTicker());
        });

        roomPreviewer.getRoomCanvas(width, height);

        resizeObserver.observe(elementRef.current);

        return () =>
        {
            GetTicker().remove(update);

            resizeObserver.disconnect();

            texture.destroy(true);
        };
    }, [ roomPreviewer, elementRef, height ]);

    return (
        <div
            ref={ elementRef }
            className="relative w-full rounded-md shadow-room-previewer"
            style={ {
                height,
                minHeight: height,
                maxHeight: height
            } }
            onClick={ onClick } />
    );
};
