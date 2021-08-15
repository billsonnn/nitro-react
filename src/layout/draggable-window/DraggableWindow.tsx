import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, Key, MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { DraggableWindowPosition, DraggableWindowProps } from './DraggableWindow.types';

const CURRENT_WINDOWS: HTMLElement[] = [];
const POS_MEMORY: Map<Key, { x: number, y: number }> = new Map();
const BOUNDS_THRESHOLD_TOP: number = 0;
const BOUNDS_THRESHOLD_LEFT: number = 0;

export const DraggableWindow: FC<DraggableWindowProps> = props =>
{
    const { uniqueKey = null, handleSelector = '.drag-handler', position = DraggableWindowPosition.CENTER, disableDrag = false, children = null } = props;
    const [ delta, setDelta ] = useState<{ x: number, y: number }>(null);
    const [ offset, setOffset ] = useState<{ x: number, y: number }>(null);
    const [ start, setStart ] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [ isDragging, setIsDragging ] = useState(false);
    const [ dragHandler, setDragHandler ] = useState<HTMLElement>(null);
    const elementRef = useRef<HTMLDivElement>();

    const bringToTop = useCallback(() =>
    {
        let zIndex = 400;

        for(const existingWindow of CURRENT_WINDOWS)
        {
            zIndex += 1;

            existingWindow.style.zIndex = zIndex.toString();
        }
    }, []);

    const onMouseDown = useCallback((event: ReactMouseEvent) =>
    {
        const index = CURRENT_WINDOWS.indexOf(elementRef.current);

        if(index === -1)
        {
            CURRENT_WINDOWS.push(elementRef.current);
        }

        else if(index === (CURRENT_WINDOWS.length - 1)) return;

        else if(index >= 0)
        {
            CURRENT_WINDOWS.splice(index, 1);

            CURRENT_WINDOWS.push(elementRef.current);
        }

        bringToTop();
    }, [ bringToTop ]);

    const onDragMouseDown = useCallback((event: MouseEvent) =>
    {
        setStart({ x: event.clientX, y: event.clientY });
        setIsDragging(true);
    }, []);

    const onDragMouseMove = useCallback((event: MouseEvent) =>
    {
        setDelta({ x: (event.clientX - start.x), y: (event.clientY - start.y) });
    }, [ start ]);

    const onDragMouseUp = useCallback((event: MouseEvent) =>
    {
        if(!elementRef.current || !dragHandler) return;
        
        let offsetX  = (offset.x + delta.x);
        let offsetY  = (offset.y + delta.y);

        const left = elementRef.current.offsetLeft + offsetX;
        const top = elementRef.current.offsetTop + offsetY;

        if(top < BOUNDS_THRESHOLD_TOP)
        {
            offsetY = -elementRef.current.offsetTop;
        }

        else if((top + dragHandler.offsetHeight) >= (document.body.offsetHeight - BOUNDS_THRESHOLD_TOP))
        {
            offsetY = (document.body.offsetHeight - elementRef.current.offsetHeight) - elementRef.current.offsetTop;
        }

        if((left + elementRef.current.offsetWidth) < BOUNDS_THRESHOLD_LEFT)
        {
            offsetX = -elementRef.current.offsetLeft;
        }

        else if(left >= (document.body.offsetWidth - BOUNDS_THRESHOLD_LEFT))
        {
            offsetX = (document.body.offsetWidth - elementRef.current.offsetWidth) - elementRef.current.offsetLeft;
        }

        setDelta({ x: 0, y: 0 });
        setOffset({ x: offsetX, y: offsetY });
        setIsDragging(false);

        if(uniqueKey !== null) POS_MEMORY.set(uniqueKey, { x: offsetX, y: offsetY });
    }, [ dragHandler, delta, offset, uniqueKey ]);

    useEffect(() =>
    {
        const element = (elementRef.current as HTMLElement);

        if(!element) return;

        CURRENT_WINDOWS.push(element);

        bringToTop();

        if(!disableDrag)
        {
            const handle = (element.querySelector(handleSelector) as HTMLElement);

            if(handle) setDragHandler(handle);
        }

        let offsetX = 0;
        let offsetY = 0;

        switch(position)
        {
            case DraggableWindowPosition.TOP_CENTER:
                element.style.top = '50px';
                element.style.left = `calc(50vw - ${ (element.offsetWidth / 2) }px)`;
                break;
            case DraggableWindowPosition.CENTER:
                element.style.top = `calc(50vh - ${ (element.offsetHeight / 2) }px)`;
                element.style.left = `calc(50vw - ${ (element.offsetWidth / 2) }px)`;
                break;
        }

        if(uniqueKey !== null)
        {
            const memory = POS_MEMORY.get(uniqueKey);

            if(memory)
            {
                offsetX = memory.x;
                offsetY = memory.y;
            }
        }

        setDelta({ x: 0, y: 0});
        setOffset({ x: offsetX, y: offsetY });

        return () =>
        {
            const index = CURRENT_WINDOWS.indexOf(element);

            if(index >= 0) CURRENT_WINDOWS.splice(index, 1);
        }
    }, [ handleSelector, position, uniqueKey, disableDrag, bringToTop ]);

    useEffect(() =>
    {
        if(!offset && !delta) return;
        
        const element = (elementRef.current as HTMLElement);

        if(!element) return;

        element.style.transform = `translate(${ offset.x + delta.x }px, ${ offset.y + delta.y }px)`;
        element.style.visibility = 'visible';
    }, [ offset, delta ]);

    useEffect(() =>
    {
        if(!dragHandler) return;

        dragHandler.addEventListener(MouseEventType.MOUSE_DOWN, onDragMouseDown);

        return () =>
        {
            dragHandler.removeEventListener(MouseEventType.MOUSE_DOWN, onDragMouseDown);
        }
    }, [ dragHandler, onDragMouseDown ]);

    useEffect(() =>
    {
        if(!isDragging) return;

        document.addEventListener(MouseEventType.MOUSE_UP, onDragMouseUp);
        document.addEventListener(MouseEventType.MOUSE_MOVE, onDragMouseMove);

        return () =>
        {
            document.removeEventListener(MouseEventType.MOUSE_UP, onDragMouseUp);
            document.removeEventListener(MouseEventType.MOUSE_MOVE, onDragMouseMove);
        }
    }, [ isDragging, onDragMouseUp, onDragMouseMove ]);

    return (
        <div ref={ elementRef } className="position-absolute draggable-window" onMouseDownCapture={ onMouseDown }>
            { children }
        </div>
    );
}
