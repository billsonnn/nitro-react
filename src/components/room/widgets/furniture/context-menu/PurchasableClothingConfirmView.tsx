import { GetAvatarRenderManager, GetSessionDataManager, RedeemItemClothingComposer, RoomObjectCategory, UserFigureComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FigureData, FurniCategory, GetFurnitureDataForRoomObject, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Base, Button, Column, Flex, LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../common';
import { useRoom } from '../../../../../hooks';

interface PurchasableClothingConfirmViewProps
{
    objectId: number;
    onClose: () => void;
}

const MODE_DEFAULT: number = -1;
const MODE_PURCHASABLE_CLOTHING: number = 0;

export const PurchasableClothingConfirmView: FC<PurchasableClothingConfirmViewProps> = props =>
{
    const { objectId = -1, onClose = null } = props;
    const [ mode, setMode ] = useState(MODE_DEFAULT);
    const [ gender, setGender ] = useState<string>(FigureData.MALE);
    const [ newFigure, setNewFigure ] = useState<string>(null);
    const { roomSession = null } = useRoom();

    const useProduct = () =>
    {
        SendMessageComposer(new RedeemItemClothingComposer(objectId));
        SendMessageComposer(new UserFigureComposer(gender, newFigure));

        onClose();
    }

    useEffect(() =>
    {
        let mode = MODE_DEFAULT;

        const figure = GetSessionDataManager().figure;
        const gender = GetSessionDataManager().gender;
        const validSets: number[] = [];

        if(roomSession && (objectId >= 0))
        {
            const furniData = GetFurnitureDataForRoomObject(roomSession.roomId, objectId, RoomObjectCategory.FLOOR);

            if(furniData)
            {
                switch(furniData.specialType)
                {
                    case FurniCategory.FIGURE_PURCHASABLE_SET:
                        mode = MODE_PURCHASABLE_CLOTHING;

                        const setIds = furniData.customParams.split(',').map(part => parseInt(part));

                        for(const setId of setIds)
                        {
                            if(GetAvatarRenderManager().isValidFigureSetForGender(setId, gender)) validSets.push(setId);
                        }

                        break;
                }
            }
        }

        if(mode === MODE_DEFAULT)
        {
            onClose();

            return;
        }
        
        setGender(gender);
        setNewFigure(GetAvatarRenderManager().getFigureStringWithFigureIds(figure, gender, validSets));

        // if owns clothing, change to it

        setMode(mode);
    }, [ roomSession, objectId, onClose ]);

    if(mode === MODE_DEFAULT) return null;
    
    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('useproduct.widget.title.bind_clothing') } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <Flex gap={ 2 } overflow="hidden">
                    <Column>
                        <Base className="mannequin-preview">
                            <LayoutAvatarImageView figure={ newFigure } direction={ 2 } />
                        </Base>
                    </Column>
                    <Column justifyContent="between" overflow="auto">
                        <Column gap={ 2 }>
                            <Text>{ LocalizeText('useproduct.widget.text.bind_clothing') }</Text>
                            <Text>{ LocalizeText('useproduct.widget.info.bind_clothing') }</Text>
                        </Column>
                        <Flex alignItems="center" justifyContent="between">
                            <Button variant="danger" onClick={ onClose }>{ LocalizeText('useproduct.widget.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('useproduct.widget.bind_clothing') }</Button>
                        </Flex>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
