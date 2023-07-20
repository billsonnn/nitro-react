import { TargetedOfferData } from '@nitrots/nitro-renderer';
import { Dispatch, SetStateAction } from 'react';
import { GetConfiguration } from '../../../../api';
import { Base, LayoutNotificationBubbleView, Text } from '../../../../common';

export const OfferBubbleView = (props: { offer: TargetedOfferData, setOpen: Dispatch<SetStateAction<boolean>> }) =>
{
    const { offer = null, setOpen = null } = props;

    if (!offer) return;

    return <LayoutNotificationBubbleView fadesOut={ false } onClose={ null } onClick={ evt => setOpen(true) } gap={ 2 }>
        <Base className="nitro-targeted-offer-icon" style={ { backgroundImage: `url(${ GetConfiguration('image.library.url') + offer.iconImageUrl })` } }/>
        <Text variant="light" className="ubuntu-bold">{ offer.title }</Text>
    </LayoutNotificationBubbleView>;
}
