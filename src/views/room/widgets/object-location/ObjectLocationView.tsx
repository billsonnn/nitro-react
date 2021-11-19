import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetNitroInstance, GetRoomEngine, GetRoomSession } from '../../../../api';
import { NitroLayoutBase } from '../../../../layout/base';
import { ObjectLocationViewProps } from './ObjectLocationView.types';

export const ObjectLocationView: FC<ObjectLocationViewProps> = props =>
{
    const { objectId = -1, category = -1, noFollow = false, children = null, ...rest } = props;
    const [ pos, setPos ] = useState<{ x: number, y: number }>({ x: -1, y: -1 });
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
        let remove = false;

        if(noFollow)
        {
            updatePosition();
        }
        else
        {
            remove = true;

            GetNitroInstance().ticker.add(updatePosition);
        }

        return () =>
        {
            if(remove) GetNitroInstance().ticker.remove(updatePosition);
        }
    }, [ updatePosition, noFollow ]);

    return (
        <NitroLayoutBase innerRef={ elementRef } className={ 'object-location position-absolute ' + ( (pos.x + (elementRef.current ? elementRef.current.offsetWidth : 0 ) )> -1 ? 'visible' : 'invisible') } style={ { left: pos.x, top: pos.y } } { ...rest }>
            { children }
        </NitroLayoutBase>
    );
}
