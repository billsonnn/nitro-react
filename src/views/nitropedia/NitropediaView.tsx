import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, GetConfiguration, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';

const newLineRegex = /\n\r|\n|\r/mg;
const internalLinkPrefix = 'event:';
export const NitropediaView: FC<{}> = props =>
{
    const [ content, setContent ] = useState<string>(null);
    const [ header, setHeader ] = useState<string>('');
    const elementRef = useRef<HTMLDivElement>(null);
    
    const openPage = useCallback((link: string) =>
    {
        fetch(link)
        .then(response => response.text())
        .then(data =>
            {
                const splitData = data.split(newLineRegex);
                setHeader(splitData.shift());
                setContent(splitData.join(''));
            })
    }, []);
    
    const onLinkReceived = useCallback((link: string) =>
    {
        const value = link.split('/');

        if(value.length < 2) return;

        value.shift();

        openPage(GetConfiguration<string>('habbopages.url') + value.join('/'));
    }, [openPage]);

    const onClick = useCallback((event: MouseEvent) =>
    {
        if(event.target instanceof HTMLAnchorElement)
        {
            event.preventDefault();
            const link = event.target.href;

            if(link.startsWith(internalLinkPrefix))
            {
                const internalLink = link.substring(internalLinkPrefix.length);
                CreateLinkEvent(internalLink);
            }

            else
            {
                window.open(link);
            }
        }
        
    },[]);

    useEffect(() =>
    {
        const linkTracker = { linkReceived: onLinkReceived, eventUrlPrefix: 'habbopages/' };
        AddEventLinkTracker(linkTracker);

        return () =>
        {
            RemoveLinkEventTracker(linkTracker);
        }
    }, [onLinkReceived]);

    useEffect(() =>
    {
        const element = elementRef.current;

        if(element)
        {
            element.addEventListener(MouseEventType.MOUSE_CLICK, onClick);
        }

        return () =>
        {
            if(element) element.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
        }
    }, [onClick, content]);

    if(!content) return null;

    return (
        <NitroCardView className="nitropedia">
            <NitroCardHeaderView headerText={header} onCloseClick={() => setContent(null)}/>
            <NitroCardContentView>
                <div ref={elementRef} className="w-100 h-100 text-black" dangerouslySetInnerHTML={{ __html: content }} />
            </NitroCardContentView>
        </NitroCardView>
    );
}
