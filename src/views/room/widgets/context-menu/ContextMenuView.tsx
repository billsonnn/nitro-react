import { FixedSizeStack, Nitro } from 'nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetRoomObjectBounds, GetRoomSession, GetTicker } from '../../../../api';
import { ContextMenuViewProps } from './ContextMenuView.types';

const fadeDelay = 3000;
const fadeLength = 75;
const SPACE_AROUND_EDGES = 10;

export const ContextMenuView: FC<ContextMenuViewProps> = props =>
{
    const { objectId = -1, category = -1, fades = false, className = '', close = null, children = null } = props;
    const [ pos, setPos ] = useState<{ x: number, y: number }>({ x: null, y: null });
    const [ stack, setStack ] = useState<FixedSizeStack>(null);
    const [ opacity, setOpacity ] = useState(1);
    const [ isFading, setIsFading ] = useState(false);
    const [ fadeTime, setFadeTime ] = useState(0);
    const elementRef = useRef<HTMLDivElement>();

    const update = useCallback((time: number) =>
    {
        let newFadeTime = time;
        let newOpacity = 1;

        if(isFading)
        {
            setFadeTime(prevValue =>
                {
                    newFadeTime += prevValue;

                    return newFadeTime;
                });

            newOpacity = ((1 - (newFadeTime / fadeLength)) * 1);

            if(newOpacity <= 0)
            {
                close();

                return;
            }

            setOpacity(newOpacity);
        }

        const bounds = GetRoomObjectBounds(GetRoomSession().roomId, objectId, category);

        if(!bounds || !elementRef.current) return;

        let left = Math.round((bounds.left + (bounds.width / 2)) - (elementRef.current.offsetWidth / 2));
        let top = Math.round((bounds.top - elementRef.current.offsetHeight));

        const maxLeft = ((Nitro.instance.width - elementRef.current.offsetWidth) - SPACE_AROUND_EDGES);
        const maxTop = ((Nitro.instance.height - elementRef.current.offsetHeight) - SPACE_AROUND_EDGES);

        if(left < SPACE_AROUND_EDGES) left = SPACE_AROUND_EDGES;
        else if(left > maxLeft) left = maxLeft;

        if(top < SPACE_AROUND_EDGES) top = SPACE_AROUND_EDGES;
        else if(top > maxTop) top = maxTop;

        setPos({
            x: left,
            y: top
        });
    }, [ objectId, category, isFading, close ]);

    useEffect(() =>
    {
        setStack(new FixedSizeStack(25));
    }, []);

    useEffect(() =>
    {
        GetTicker().add(update);

        return () =>
        {
            GetTicker().remove(update);
        }
    }, [ update ]);

    useEffect(() =>
    {
        if(!fades) return;

        const timeout = setTimeout(() => setIsFading(true), fadeDelay);

        return () =>
        {
            clearTimeout(timeout);
        }
    }, [ fades ]);

    return (
        <div ref={ elementRef } className={ `position-absolute nitro-context-menu ${ className }${ (pos.x !== null ? ' visible' : ' invisible') }` } style={ { left: (pos.x || 0), top: (pos.y || 0), opacity: opacity } }>
            { children }
        </div>
    );
}
