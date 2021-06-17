import { Nitro } from 'nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetRoomEngine, GetRoomSession } from '../../../../api';
import { ObjectLocationViewProps } from './ObjectLocationView.types';

export const ObjectLocationView: FC<ObjectLocationViewProps> = props =>
{
    const { objectId = -1, category = -1, children = null } = props;
    const [ pos, setPos ] = useState<{ x: number, y: number }>({ x: -1, y: -1});
    const elementRef = useRef<HTMLDivElement>();

    const getObjectLocation = useCallback(() =>
    {
        const roomSession = GetRoomSession();
        const objectBounds = GetRoomEngine().getRoomObjectBoundingRectangle(roomSession.roomId, objectId, category, 1);

        return objectBounds;
    }, [ objectId, category ]);

    const updatePosition = useCallback(() =>
    {
        const bounds = getObjectLocation();

        if(!bounds || !elementRef.current) return;

        setPos({
            x: Math.round(((bounds.left + (bounds.width / 2)) - (elementRef.current.offsetWidth / 2))),
            y: Math.round((bounds.top - elementRef.current.offsetHeight) + 10)
        });
    }, [ getObjectLocation ]);

    useEffect(() =>
    {
        Nitro.instance.ticker.add(updatePosition);

        return () =>
        {
            Nitro.instance.ticker.remove(updatePosition);
        }
    }, [ updatePosition ]);

    return (
        <div ref={ elementRef } className={ 'object-location position-absolute ' + (pos.x > -1 ? 'visible' : 'invisible') } style={ { left: pos.x, top: pos.y } }>
            { children }
        </div>
    );
}
