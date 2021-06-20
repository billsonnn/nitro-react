import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetRoomObjectBounds, GetRoomSession, GetTicker } from '../../../../api';
import { ContextMenuViewFadeOptions, ContextMenuViewProps } from './ContextMenuView.types';

export const ContextMenuView: FC<ContextMenuViewProps> = props =>
{
    const { objectId = -1, category = -1, fades = false, onClose = null, children = null } = props;
    const [ pos, setPos ] = useState<{ x: number, y: number }>({ x: -1, y: -1});
    const [ opacity, setOpacity ] = useState(1);
    const [ fadeOptions, setFadeOptions ] = useState<ContextMenuViewFadeOptions>({
        firstFadeStarted: false,
        fadeAfterDelay: true,
        fadeLength: 75,
        fadeTime: 0,
        fadeStartDelay: 3000,
        fadingOut: false
    });
    const elementRef = useRef<HTMLDivElement>();

    const update = useCallback((time: number) =>
    {
        const bounds = GetRoomObjectBounds(GetRoomSession().roomId, objectId, category);

        if(!bounds || !elementRef.current) return;

        setPos({
            x: Math.round(((bounds.left + (bounds.width / 2)) - (elementRef.current.offsetWidth / 2))),
            y: Math.round((bounds.top - elementRef.current.offsetHeight) + 10)
        });
    }, [ objectId, category ]);

    useEffect(() =>
    {
        GetTicker().add(update);

        return () =>
        {
            GetTicker().remove(update);
        }
    }, [ update ]);

    return (
        <div ref={ elementRef } className={ 'nitro-context-menu position-absolute ' + (pos.x > -1 ? 'visible' : 'invisible') } style={ { left: pos.x, top: pos.y } }>
            { children }
        </div>
    );
}
