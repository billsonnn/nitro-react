import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AddEventLinkTracker, GetConfiguration, NotificationUtilities, RemoveLinkEventTracker } from '../../api';
import { Base, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { BatchUpdates } from '../../hooks';

const NEW_LINE_REGEX = /\n\r|\n|\r/mg;

export const NitropediaView: FC<{}> = props =>
{
    const [ content, setContent ] = useState<string>(null);
    const [ header, setHeader ] = useState<string>('');
    const elementRef = useRef<HTMLDivElement>(null);
    
    const openPage = useCallback(async (link: string) =>
    {
        const response = await fetch(link);

        if(!response) return;

        const text = await response.text();

        const splitData = text.split(NEW_LINE_REGEX);
        
        BatchUpdates(() =>
        {
            setHeader(splitData.shift());
            setContent(splitData.join(''));
        });
    }, []);

    const onClick = useCallback((event: MouseEvent) =>
    {
        if(!(event.target instanceof HTMLAnchorElement)) return;
        
        event.preventDefault();
            
        const link = event.target.href;

        NotificationUtilities.openUrl(link);
    }, []);

    const onLinkReceived = useCallback((link: string) =>
    {
        const value = link.split('/');

        if(value.length < 2) return;

        value.shift();

        openPage(GetConfiguration<string>('habbopages.url') + value.join('/'));
    }, [ openPage ]);

    useEffect(() =>
    {
        const linkTracker = { linkReceived: onLinkReceived, eventUrlPrefix: 'habbopages/' };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ onLinkReceived ]);

    useEffect(() =>
    {
        const element = elementRef.current;

        if(!element) return;
        
        element.addEventListener(MouseEventType.MOUSE_CLICK, onClick);

        return () => element.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
    }, [ onClick, content ]);

    if(!content) return null;

    return (
        <NitroCardView className="nitropedia">
            <NitroCardHeaderView headerText={header} onCloseClick={() => setContent(null)}/>
            <NitroCardContentView>
                <Base fit innerRef={ elementRef } className="text-black" dangerouslySetInnerHTML={{ __html: content }} />
            </NitroCardContentView>
        </NitroCardView>
    );
}
