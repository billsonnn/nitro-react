import { FC, useCallback, useState } from 'react';
import { AddEventLinkTracker, GetConfiguration } from '../../api';
import { UseMountEffect } from '../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../layout';

const regex = /\n\r|\n|\r/mg;
export const NitropediaView: FC<{}> = props =>
{
    const [ content, setContent ] = useState<string>(null);
    const [ header, setHeader ] = useState<string>('');
    
    const openPage = useCallback((link: string) =>
    {
        fetch(link)
        .then(response => response.text())
        .then(data =>
            {
                const splitData = data.split(regex);
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

    UseMountEffect(() =>
    {
        AddEventLinkTracker({ linkReceived: onLinkReceived, eventUrlPrefix: 'habbopages/' });
    });

    if(!content) return null;

    return (
        <NitroCardView className="nitropedia">
            <NitroCardHeaderView headerText={header} onCloseClick={() => setContent(null)}/>
            <NitroCardContentView>
                {content && <div className="w-100 h-100 text-black" dangerouslySetInnerHTML={{ __html: content }} />}
            </NitroCardContentView>
        </NitroCardView>
    );
}
