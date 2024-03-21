import { CreateLinkEvent } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { attemptItemPlacement, LocalizeText } from '../../../../api';
import { Button, Column, Flex, LayoutGiftTagView, LayoutImage, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFurniturePresentWidget, useInventoryFurni } from '../../../../hooks';

export const FurnitureGiftOpeningView: FC<{}> = props =>
{
    const { objectId = -1, classId = -1, itemType = null, text = null, isOwnerOfFurniture = false, senderName = null, senderFigure = null, placedItemId = -1, placedItemType = null, placedInRoom = false, imageUrl = null, openPresent = null, onClose = null } = useFurniturePresentWidget();
    const { groupItems = [] } = useInventoryFurni();

    if(objectId === -1) return null;

    const place = (itemId: number) =>
    {
        const groupItem = groupItems.find(group => (group.getItemById(itemId)?.id === itemId));

        if(groupItem) attemptItemPlacement(groupItem);

        onClose();
    }

    return (
        <NitroCardView className="nitro-gift-opening" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText(senderName ? 'widget.furni.present.window.title_from' : 'widget.furni.present.window.title', [ 'name' ], [ senderName ]) } onCloseClick={ onClose } />
            <NitroCardContentView>
                { (placedItemId === -1) &&
                    <Column overflow="hidden">
                        <Flex center overflow="auto">
                            <LayoutGiftTagView userName={ senderName } figure={ senderFigure } message={ text } />
                        </Flex>
                        { isOwnerOfFurniture &&
                            <Flex gap={ 1 }>
                                { senderName &&
                                    <Button fullWidth onClick={ event => CreateLinkEvent('catalog/open') }>
                                        { LocalizeText('widget.furni.present.give_gift', [ 'name' ], [ senderName ]) }
                                    </Button> }
                                <Button fullWidth variant="success" onClick={ openPresent }>
                                    { LocalizeText('widget.furni.present.open_gift') }
                                </Button>
                            </Flex> }
                    </Column> }
                { (placedItemId > -1) &&
                    <Flex gap={ 2 } overflow="hidden">
                        <Column center className="p-2">
                            <LayoutImage imageUrl={ imageUrl } />
                        </Column>
                        <Column grow>
                            <Column center gap={ 1 }>
                                <Text wrap small>{ LocalizeText('widget.furni.present.message_opened') }</Text>
                                <Text bold fontSize={ 5 }>{ text }</Text>
                            </Column>
                            <Column grow gap={ 1 }>
                                <Flex gap={ 1 }>
                                    { placedInRoom &&
                                        <Button fullWidth onClick={ null }>
                                            { LocalizeText('widget.furni.present.put_in_inventory') }
                                        </Button> }
                                    <Button fullWidth variant="success" onClick={ event => place(placedItemId) }>
                                        { LocalizeText(placedInRoom ? 'widget.furni.present.keep_in_room' : 'widget.furni.present.place_in_room') }
                                    </Button>
                                </Flex>
                                { (senderName && senderName.length) &&
                                    <Button fullWidth onClick={ event => CreateLinkEvent('catalog/open') }>
                                        { LocalizeText('widget.furni.present.give_gift', [ 'name' ], [ senderName ]) }
                                    </Button> }
                            </Column>
                        </Column>
                    </Flex> }
            </NitroCardContentView>
        </NitroCardView>
    );
}
