import { FC, MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import Draggable from 'react-draggable';
import { DraggableWindowProps } from './DraggableWindow.types';

const currentWindows: HTMLDivElement[] = [];

export const DraggableWindow: FC<DraggableWindowProps> = props =>
{
    const { disableDrag = false, noCenter = false, handle = '.drag-handler', draggableOptions = {}, children = null } = props;
    const elementRef = useRef<HTMLDivElement>();

    const bringToTop = useCallback(() =>
    {
        let zIndex = 400;

        for(const existingWindow of currentWindows)
        {
            zIndex += 1;

            existingWindow.style.zIndex = zIndex.toString();
        }
    }, []);

    const onMouseDown = useCallback((event: MouseEvent) =>
    {
        const index = currentWindows.indexOf(elementRef.current);

        if(index === -1)
        {
            currentWindows.push(elementRef.current);
        }

        else if(index === (currentWindows.length - 1)) return;

        else if(index >= 0)
        {
            currentWindows.splice(index, 1);

            currentWindows.push(elementRef.current);
        }

        bringToTop();
    }, [ bringToTop ]);

    useEffect(() =>
    {
        if(!elementRef) return;
        
        const element = elementRef.current;

        currentWindows.push(element);

        bringToTop();

        if(!noCenter)
        {
            const left = ((document.body.clientWidth / 2) - (element.clientWidth / 2));
            const top = ((document.body.clientHeight / 2) - (element.clientHeight / 2));

            element.style.left = `${ left }px`;
            element.style.top = `${ top }px`;
        }

        element.style.visibility = 'visible';

        return () =>
        {
            const index = currentWindows.indexOf(element);

            if(index >= 0) currentWindows.splice(index, 1);
        }
    }, [ elementRef, noCenter, bringToTop ]);

    const getWindowContent = useMemo(() =>
    {
        return (
            <div ref={ elementRef } className="position-absolute draggable-window" onMouseDownCapture={ onMouseDown }>
                { children }
            </div>
        );
    }, [ children, onMouseDown ]);

    return disableDrag ? getWindowContent : <Draggable handle={ handle } { ...draggableOptions }>{ getWindowContent }</Draggable>;
}
