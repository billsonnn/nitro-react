import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { Base, NitroCardContentView } from '../../../../common';

interface NavigatorSearchResultItemInfoViewProps
{
    roomData: RoomDataParser;
}

export const NavigatorSearchResultItemInfoView: FC<NavigatorSearchResultItemInfoViewProps> = props =>
{
    const { roomData = null } = props;
    const [ target, setTarget ] = useState<(EventTarget & HTMLElement)>(null);
    const [ isVisible, setIsVisible ] = useState(false);

    const toggle = (event: MouseEvent<HTMLElement>) =>
    {
        event.stopPropagation();
        
        let visible = false;

        setIsVisible(prevValue =>
        {
            visible = !prevValue;

            return visible;
        });

        if(visible) setTarget((event.target as (EventTarget & HTMLElement)));
    }

    useEffect(() =>
    {
        if(isVisible) return;

        setTarget(null);
    }, [ isVisible ]);

    return (
        <>
            <Base pointer className="icon icon-navigator-info" onClick={ toggle } />
            <Overlay show={ isVisible } target={ target } placement="right">
                <Popover>
                    <NitroCardContentView overflow="hidden" className="bg-transparent">
                        do it
                    </NitroCardContentView>
                </Popover>
            </Overlay>
        </>
    );
}
