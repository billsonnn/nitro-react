import { GetTicker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetRoomObjectBounds, GetRoomSession } from '../../../../api';
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

    useEffect(() =>
    {
        let remove = false;

        const getObjectLocation = () =>
        {
            const roomSession = GetRoomSession();
            const objectBounds = GetRoomObjectBounds(roomSession.roomId, objectId, category, 1);

            return objectBounds;
        }

        const updatePosition = () =>
        {
            const bounds = getObjectLocation();

            if(!bounds || !elementRef.current) return;

            setPos({
                x: Math.round(((bounds.left + (bounds.width / 2)) - (elementRef.current.offsetWidth / 2))),
                y: Math.round((bounds.top - elementRef.current.offsetHeight) + 10)
            });
        }

        if(noFollow)
        {
            updatePosition();
        }
        else
        {
            remove = true;

            GetTicker().add(updatePosition);
        }

        return () =>
        {
            if(remove) GetTicker().remove(updatePosition);
        }
    }, [ objectId, category, noFollow ]);

    return <Base innerRef={ elementRef } position={ position } visible={ (pos.x + (elementRef.current ? elementRef.current.offsetWidth : 0)) > -1 } className="object-location" style={ { left: pos.x, top: pos.y } } { ...rest } />;
}
