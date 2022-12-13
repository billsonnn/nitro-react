import { GetTargetedOfferComposer, TargetedOfferData, TargetedOfferEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { SendMessageComposer } from '../../../../api';
import { useMessageEvent, UseMountEffect } from '../../../../hooks';
import { OfferBubbleView } from './OfferBubbleView';
import { OfferWindowView } from './OfferWindowView';

export const OfferView = () =>
{
    const [ offer, setOffer ] = useState<TargetedOfferData>(null);
    const [ opened, setOpened ] = useState<boolean>(false);

    useMessageEvent<TargetedOfferEvent>(TargetedOfferEvent, evt =>
    {
        let parser = evt.getParser();

        if (!parser) return;

        setOffer(parser.data);
    });

    UseMountEffect(() =>
    {
        SendMessageComposer(new GetTargetedOfferComposer());
    })

    if (!offer) return;
    
    return <>
        { opened ? <OfferWindowView offer={ offer } setOpen={ setOpened } /> : <OfferBubbleView offer={ offer } setOpen={ setOpened } /> }
    </>
}
