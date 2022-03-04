import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetNitroInstance, GetRoomEngine, GetRoomSession } from '../../../../api';
import { Base, BaseProps } from '../../../../common';

interface ObjectLocationViewProps extends BaseProps<HTMLDivElement>
{
    objectId: number;
    category: number;
    noFollow?: boolean;
}

export const ObjectLocationView: FC<ObjectLocationViewProps> = props =>
{
    const { objectId = -1, category = -1, noFollow = false, position = 'absolute', ...rest } = props;
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

    return <Base innerRef={ elementRef } position={ position } visible={ (pos.x + (elementRef.current ? elementRef.current.offsetWidth : 0)) > -1 } className="object-location" style={ { left: pos.x, top: pos.y } } { ...rest } />;
}
