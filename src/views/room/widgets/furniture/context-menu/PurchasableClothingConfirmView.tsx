import { RedeemItemClothingComposer, RoomObjectCategory, UserFigureComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetAvatarRenderManager, GetConnection, GetFurnitureDataForRoomObject, GetSessionDataManager, LocalizeText } from '../../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../../common';
import { FigureData } from '../../../../../components/avatar-editor/common/FigureData';
import { FurniCategory } from '../../../../../components/inventory/common/FurniCategory';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { AvatarImageView } from '../../../../shared/avatar-image/AvatarImageView';
import { useRoomContext } from '../../../context/RoomContext';

interface PurchasableClothingConfirmViewProps
{
    objectId: number;
    close: () => void;
}

const MODE_DEFAULT: number = -1;
const MODE_PURCHASABLE_CLOTHING: number = 0;

export const PurchasableClothingConfirmView: FC<PurchasableClothingConfirmViewProps> = props =>
{
    const { objectId = -1, close = null } = props;
    const [ mode, setMode ] = useState(MODE_DEFAULT);
    const [ gender, setGender ] = useState<string>(FigureData.MALE);
    const [ newFigure, setNewFigure ] = useState<string>(null);
    const { roomSession = null } = useRoomContext();

    const useProduct = () =>
    {
        GetConnection().send(new RedeemItemClothingComposer(objectId));
        GetConnection().send(new UserFigureComposer(gender, newFigure));

        close();
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
            close();

            return;
        }
        
        setGender(gender);
        setNewFigure(GetAvatarRenderManager().getFigureStringWithFigureIds(figure, gender, validSets));

        // if owns clothing, change to it

        setMode(mode);
    }, [ roomSession, objectId, close ]);

    if(mode === MODE_DEFAULT) return null;
    
    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('useproduct.widget.title.bind_clothing') } onCloseClick={ close } />
            <NitroCardContentView center>
                <Flex gap={ 2 } overflow="hidden">
                    <Column>
                        <Base className="mannequin-preview">
                            <AvatarImageView figure={ newFigure } direction={ 2 } />
                        </Base>
                    </Column>
                    <Column justifyContent="between" overflow="auto">
                        <Column gap={ 2 }>
                            <Text>{ LocalizeText('useproduct.widget.text.bind_clothing') }</Text>
                            <Text>{ LocalizeText('useproduct.widget.info.bind_clothing') }</Text>
                        </Column>
                        <Flex alignItems="center" justifyContent="between">
                            <Button variant="danger" onClick={ close }>{ LocalizeText('useproduct.widget.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('useproduct.widget.bind_clothing') }</Button>
                        </Flex>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
