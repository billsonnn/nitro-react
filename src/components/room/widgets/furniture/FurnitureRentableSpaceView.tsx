import { FriendlyTime } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Column, Flex, LayoutCurrencyIcon, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFurnitureRentableSpaceWidget } from '../../../../hooks';

export const FurnitureRentableSpaceView: FC<{}> = props =>
{
    const { renter, isRoomOwner, onRent, onCancelRent, onClose } = useFurnitureRentableSpaceWidget();
    
    if(!renter) return null;

    return (
        <NitroCardView className="nitro-guide-tool no-resize" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('rentablespace.widget.title') } onCloseClick={ onClose } />
            <NitroCardContentView className="text-black">
                <Column>
                    { (!renter.rented) &&
                        <>
                            <Text>{ LocalizeText('rentablespace.widget.instructions') }</Text>
                            <Flex pointer center className="p-2 bg-primary border border-dark rounded text-light h3" onClick={ onRent }>
                                { renter.price + ' x' }&nbsp;
                                <LayoutCurrencyIcon type={ -1 } className="mt-1" />&nbsp;
                                { LocalizeText('catalog.purchase_confirmation.rent') }
                            </Flex>
                        </>
                    }
                    { (renter.rented) &&
                        <>
                            <Text bold>{ LocalizeText('rentablespace.widget.rented_to_label') }</Text>
                            <Text italics>{ renter.renterName }</Text>
                            <Text bold>{ LocalizeText('rentablespace.widget.expires_label') }</Text>
                            <Text italics>{ FriendlyTime.shortFormat(renter.timeRemaining) }</Text>
                            { (isRoomOwner) &&
                                <Button variant="danger" className="mt-2" onClick={ onCancelRent }>{ LocalizeText('rentablespace.widget.cancel_rent') }</Button> }

                        </>
                    }
                </Column>
            </NitroCardContentView>
        </NitroCardView>
    );
}
