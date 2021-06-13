import { Nitro } from 'nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { GetRoomEngine, GetRoomSession } from '../../../../api';
import { ObjectLocationViewProps } from './ObjectLocationView.types';

export const ObjectLocationView: FC<ObjectLocationViewProps> = props =>
{
    const { objectId = -1, category = -1, children = null } = props;
    const [ posX, setPosX ] = useState(0);
    const [ posY, setPosY ] = useState(0);
    const elementRef = useRef<HTMLDivElement>();

    const updatePosition = useCallback(() =>
    {
        const roomSession = GetRoomSession();
        const objectBounds = GetRoomEngine().getRoomObjectBoundingRectangle(roomSession.roomId, objectId, category, 1);

        if(!objectBounds || !elementRef.current) return;

        setPosX(Math.round(((objectBounds.left + (objectBounds.width / 2)) - (elementRef.current.offsetWidth / 2))));
        setPosY(Math.round((objectBounds.top - elementRef.current.offsetHeight) + 10));
    }, [ objectId, category ]);

    useEffect(() =>
    {
        Nitro.instance.ticker.add(updatePosition);

        return () =>
        {
            Nitro.instance.ticker.remove(updatePosition);
        }
    }, [ updatePosition ]);

    return (
        <div ref={ elementRef } className="position-absolute" style={ { left: posX, top: posY } }>
            { children }
        </div>
    );
}
