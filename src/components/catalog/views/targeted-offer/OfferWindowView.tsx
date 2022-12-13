import { FriendlyTime, GetTargetedOfferComposer, PurchaseTargetedOfferComposer, TargetedOfferData } from '@nitrots/nitro-renderer';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { GetConfiguration, LocalizeText, SendMessageComposer } from '../../../../api';
import { Base, Button, Column, Flex, LayoutCurrencyIcon, NitroCardContentView, NitroCardHeaderView, NitroCardSubHeaderView, NitroCardView, Text } from '../../../../common';
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

        if (offer.priceInCredits > 0) credits = getCurrencyAmount(-1) >= offer.priceInCredits;
        
        if (offer.priceInActivityPoints > 0) points = getCurrencyAmount(offer.activityPointType) >= offer.priceInActivityPoints;
        else points = true;

        if (offer.purchaseLimit > 0) limit = true;
        
        return (credits && points && limit);
    },[ offer,getCurrencyAmount ])

    const expirationTime = () =>
    {
        let expirationTime = Math.max(0, (offer.expirationTime - Date.now() ) / 1000)

        return FriendlyTime.format(expirationTime);
    }

    const buyOffer = () =>
    {
        SendMessageComposer(new PurchaseTargetedOfferComposer(offer.id, amount));
        SendMessageComposer(new GetTargetedOfferComposer());
    }

    if (!offer) return;

    return <NitroCardView theme="primary-slim" uniqueKey="targeted-offer" className="nitro-targeted-offer">
        <NitroCardHeaderView headerText={ LocalizeText(offer.title) } onCloseClick={ event => setOpen(false) } />
        <NitroCardSubHeaderView position="relative" className="justify-content-center align-items-center cursor-pointer" variant="danger" gap={ 3 }>
            { LocalizeText('targeted.offer.timeleft',[ 'timeleft' ],[ expirationTime() ]) }
        </NitroCardSubHeaderView>
        <NitroCardContentView gap={ 1 }>
            <Flex gap={ 1 } fullHeight>
                <Flex gap={ 1 } column className="w-75 text-black">
                    <Column className="bg-warning p-2" fullHeight>
                        <h4>
                            { LocalizeText(offer.title) }
                        </h4>
                        <Base dangerouslySetInnerHTML={ { __html: offer.description } }/>
                    </Column>
                    <Flex alignSelf="center" alignItems="center" justifyContent="center" gap={ 2 }>
                        { offer.purchaseLimit > 1 && <Flex gap={ 1 }>
                            <Text variant="muted">{ LocalizeText('catalog.bundlewidget.quantity') }</Text>
                            <input type="number" value={ amount } onChange={ evt => setAmount(parseInt(evt.target.value)) } min={ 1 } max={ offer.purchaseLimit } />
                        </Flex> }
                        <Button variant="primary" disabled={ !canPurchase } onClick={ () => buyOffer() }>{ LocalizeText('targeted.offer.button.buy') }</Button>
                    </Flex>
                </Flex>
                <Base className="w-50" fullHeight style={ { background: `url(${ GetConfiguration('image.library.url') + offer.imageUrl }) no-repeat center` } } />
            </Flex>
            <Flex className="price-ray position-absolute" alignItems="center" justifyContent="center" column>
                <Text>{ LocalizeText('targeted.offer.price.label') }</Text>
                { offer.priceInCredits > 0 && <Flex gap={ 1 }>
                    <Text variant="light">{ offer.priceInCredits }</Text>
                    <LayoutCurrencyIcon type={ -1 } />
                </Flex> }
                { offer.priceInActivityPoints > 0 && <Flex gap={ 1 }>
                    <Text className="ubuntu-bold" variant="light">+{ offer.priceInActivityPoints }</Text> <LayoutCurrencyIcon type={ offer.activityPointType }/>
                </Flex> }
            </Flex>
        </NitroCardContentView>
    </NitroCardView>;
    
    // return <Frame onCloseClick={ () => setOpen(false) } title={ LocalizeText(offer.title) } className="ton-targeted-offer">
    //     <Border fullHeight className="p-1" gap={ 1 } justifyContent="center">
    //         <Border skin={ 4 } colour={ VolterColours.primary_red } className="p-1 text-center volter-bold">{ LocalizeText('targeted.offer.timeleft',[ 'timeleft' ],[ expirationTime() ]) }</Border>
    //         <Flex gap={ 1 } fullHeight>
    //             <Flex gap={ 1 } column className="w-75 text-black">
    //                 <Border skin={ 0 } fullHeight fullWidth colour={ VolterColours.lighter_yellow }>
    //                     <h4 className="ubuntu-bold">
    //                         { LocalizeText(offer.title) }
    //                     </h4>
    //                     <h5 className="ubuntu" dangerouslySetInnerHTML={ { __html: offer.description } }/>
    //                 </Border>
    //                 <Flex alignSelf="center" alignItems="center" justifyContent="center" gap={ 2 }>
    //                     { offer.purchaseLimit > 1 && <Flex gap={ 1 }>
    //                         <Text variant="muted">{ LocalizeText('catalog.bundlewidget.quantity') }</Text>
    //                         <input type="number" value={ amount } onChange={ evt => setAmount(parseInt(evt.target.value)) } min={ 1 } max={ offer.purchaseLimit } />
    //                     </Flex> }
    //                     <Button skin={ canPurchase ? 6 : 5 } colour={ canPurchase ? VolterColours.primary_green : VolterColours.white } disabled={ !canPurchase } onClick={ () => buyOffer() }>{ LocalizeText('targeted.offer.button.buy') }</Button>
    //                 </Flex>
    //             </Flex>
    //             <Base className="w-50" fullHeight style={ { background: `url(${ GetConfiguration('image.library.url') + offer.imageUrl }) no-repeat center` } } />
    //         </Flex>
    //         <Flex className="price-ray position-absolute" alignItems="center" justifyContent="center" column>
    //             <Text className="ubuntu">{ LocalizeText('targeted.offer.price.label') }</Text>
    //             { offer.priceInCredits > 0 && <Flex gap={ 1 }>
    //                 <Text className="ubuntu-bold" variant="light">{ offer.priceInCredits }</Text>
    //                 <LayoutCurrencyIcon type={ -1 } />
    //             </Flex> }
    //             { offer.priceInActivityPoints > 0 && <Flex gap={ 1 }>
    //                 <Text className="ubuntu-bold" variant="light">+{ offer.priceInActivityPoints }</Text> <LayoutCurrencyIcon type={ offer.activityPointType }/>
    //             </Flex> }
    //         </Flex>
    //     </Border>
    // </Frame>;
}
