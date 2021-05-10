import { FC, MouseEvent, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { DraggableWindowProps } from './DraggableWindow.types';

const currentWindows: HTMLDivElement[] = [];

export const DraggableWindow: FC<DraggableWindowProps> = props =>
{
    const { disableDrag = false } = props;

    const elementRef = useRef<HTMLDivElement>();

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
        if(!elementRef) return;
        
        const element = elementRef.current;

        currentWindows.push(element);

        bringToTop();

        const left = ((element.parentElement.clientWidth - element.clientWidth) / 2);
        const top = ((element.parentElement.clientHeight - element.clientHeight) / 2);

        element.style.left = `${ left }px`;
        element.style.top = `${ top }px`;

        return () =>
        {
            const index = currentWindows.indexOf(element);

            if(index >= 0) currentWindows.splice(index, 1);
        }
    }, [ elementRef ]);

    function getWindowContent(): JSX.Element
    {
        return (
            <div ref={ elementRef } className="position-absolute draggable-window" onMouseDownCapture={ onMouseDown }>
                { props.children }
            </div>
        );
    }

    if(disableDrag) return getWindowContent();

    return (
        <Draggable handle={ props.handle } { ...props.draggableOptions }>
            { getWindowContent() }
        </Draggable>
    );
}
