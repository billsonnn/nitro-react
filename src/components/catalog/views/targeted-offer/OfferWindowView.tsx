import { GetTargetedOfferComposer, PurchaseTargetedOfferComposer, TargetedOfferData } from '@nitrots/nitro-renderer';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { FriendlyTime, GetConfigurationValue, LocalizeText, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, LayoutCurrencyIcon, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { usePurse } from '../../../../hooks';

export const OfferWindowView = (props: { offer: TargetedOfferData, setOpen: Dispatch<SetStateAction<boolean>> }) =>
{
    const { offer = null, setOpen = null } = props;

    const { getCurrencyAmount } = usePurse();

    const [ amount, setAmount ] = useState<number>(1);

    const canPurchase = useMemo(() =>
    {
        let credits = false;
        let points = false;
        let limit = false;

        if(offer.priceInCredits > 0) credits = getCurrencyAmount(-1) >= offer.priceInCredits;

        if(offer.priceInActivityPoints > 0) points = getCurrencyAmount(offer.activityPointType) >= offer.priceInActivityPoints;
        else points = true;

        if(offer.purchaseLimit > 0) limit = true;

        return (credits && points && limit);
    }, [ offer, getCurrencyAmount ]);

    const expirationTime = () =>
    {
        let expirationTime = Math.max(0, (offer.expirationTime - Date.now()) / 1000);

        return FriendlyTime.format(expirationTime);
    };

    const buyOffer = () =>
    {
        SendMessageComposer(new PurchaseTargetedOfferComposer(offer.id, amount));
        SendMessageComposer(new GetTargetedOfferComposer());
    };

    if(!offer) return;

    return <NitroCardView className="nitro-targeted-offer" theme="primary-slim" uniqueKey="targeted-offer">
        <NitroCardHeaderView headerText={ LocalizeText(offer.title) } onCloseClick={ event => setOpen(false) } />
        <div className="container-fluid p-1 relative justify-center items-center cursor-pointer gap-3 bg-danger">
            { LocalizeText('targeted.offer.timeleft', [ 'timeleft' ], [ expirationTime() ]) }
        </div>
        <NitroCardContentView gap={ 1 }>
            <Flex fullHeight gap={ 1 }>
                <Flex column className="w-75 text-black" gap={ 1 }>
                    <Column fullHeight className="bg-warning p-2">
                        <h4>
                            { LocalizeText(offer.title) }
                        </h4>
                        <div dangerouslySetInnerHTML={ { __html: offer.description } } />
                    </Column>
                    <Flex alignItems="center" alignSelf="center" gap={ 2 } justifyContent="center">
                        { offer.purchaseLimit > 1 &&
                            <div className="flex gap-1">
                                <Text variant="muted">{ LocalizeText('catalog.bundlewidget.quantity') }</Text>
                                <input max={ offer.purchaseLimit } min={ 1 } type="number" value={ amount } onChange={ evt => setAmount(parseInt(evt.target.value)) } />
                            </div> }
                        <Button disabled={ !canPurchase } variant="primary" onClick={ () => buyOffer() }>{ LocalizeText('targeted.offer.button.buy') }</Button>
                    </Flex>
                </Flex>
                <div className="w-50 h-full" style={ { background: `url(${ GetConfigurationValue('image.library.url') + offer.imageUrl }) no-repeat center` } } />
            </Flex>
            <Flex column alignItems="center" className="price-ray absolute" justifyContent="center">
                <Text>{ LocalizeText('targeted.offer.price.label') }</Text>
                { offer.priceInCredits > 0 &&
                    <div className="flex gap-1">
                        <Text variant="light">{ offer.priceInCredits }</Text>
                        <LayoutCurrencyIcon type={ -1 } />
                    </div> }
                { offer.priceInActivityPoints > 0 &&
                    <div className="flex gap-1">
                        <Text className="ubuntu-bold" variant="light">+{ offer.priceInActivityPoints }</Text> <LayoutCurrencyIcon type={ offer.activityPointType } />
                    </div> }
            </Flex>
        </NitroCardContentView>
    </NitroCardView>;
};
