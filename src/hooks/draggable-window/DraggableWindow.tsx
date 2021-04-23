import { createRef, MouseEvent, useEffect } from 'react';
import Draggable from 'react-draggable';
import { DraggableWindowProps } from './DraggableWindow.types';

const currentWindows: HTMLDivElement[] = [];

export function DraggableWindow(props: DraggableWindowProps): JSX.Element
{
    const elementRef = createRef<HTMLDivElement>();

    function bringToTop(): void
    {
        let zIndex = 400;

        for(const existingWindow of currentWindows)
        {
            zIndex += 1;

            existingWindow.style.zIndex = zIndex.toString();
        }
    }

    function onMouseDown(event: MouseEvent): void
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
    }

    useEffect(() =>
    {
        const element = elementRef.current;

        currentWindows.push(element);

        bringToTop();

        return () =>
        {
            const index = currentWindows.indexOf(element);

            if(index >= 0) currentWindows.splice(index, 1);
        }
    }, [ elementRef ]);

    return (
        <Draggable handle={ props.handle } { ...props.draggableOptions }>
            <div ref={ elementRef } className="position-absolute t-0 l-0" onMouseDownCapture={ onMouseDown }>
                { props.children }
            </div>
        </Draggable>
    );
}
