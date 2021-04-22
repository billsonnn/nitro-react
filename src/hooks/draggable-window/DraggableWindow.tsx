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
            <div ref={ elementRef } className="position-absolute t-0 l-0" onMouseDown={ onMouseDown }>
                { props.children }
            </div>
        </Draggable>
    );
}
