import { NitroLogger } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AddEventLinkTracker, GetConfiguration, NotificationUtilities, RemoveLinkEventTracker } from '../../api';
import { Base, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { BatchUpdates } from '../../hooks';

const NEW_LINE_REGEX = /\n\r|\n|\r/mg;

export const NitropediaView: FC<{}> = props =>
{
    const [ content, setContent ] = useState<string>(null);
    const [ header, setHeader] = useState<string>('');
    const [wH, setWH] = useState<{w:number,h:number}>({ w:0, h:0 });
    const elementRef = useRef<HTMLDivElement>(null);
    
    const openPage = useCallback(async (link: string) =>
    {
        try
        {
            const response = await fetch(link);

            if(!response) return;
    
            const text = await response.text();
    
            const splitData = text.split(NEW_LINE_REGEX);

            setWH({ w: 0, h: 0 });
            
            BatchUpdates(() =>
            {
                let line = splitData.shift().split('|');
                setHeader(line[0]);

                if(line[1] && line[1].split(';').length === 2)
                    setWH({ w: parseInt(line[1].split(';')[0]), h: parseInt(line[1].split(';')[1]) });
                
                setContent(splitData.join(''));
            });
        }

        catch (error)
        {
            NitroLogger.error(`Failed to fetch ${ link }`);
        }
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
        const handle = (event: MouseEvent) =>
            {
                if(!(event.target instanceof HTMLAnchorElement)) return;

                event.preventDefault();

                const link = event.target.href;

                if(!link || !link.length) return;

                NotificationUtilities.openUrl(link);
            }

        document.addEventListener('click', handle);

        return () =>
        {
            document.removeEventListener('click', handle);
        }
    }, []);

    if(!content) return null;

    return (
        <NitroCardView className="nitropedia" theme="primary-slim" style={wH.w && wH.h ? { width: wH.w, height: wH.h } : {} }>
            <NitroCardHeaderView headerText={header} onCloseClick={() => setContent(null)}/>
            <NitroCardContentView>
                <Base fit innerRef={ elementRef } className="text-black" dangerouslySetInnerHTML={{ __html: content }} />
            </NitroCardContentView>
        </NitroCardView>
    );
}
