import { AvatarFigurePartType, GetAvatarRenderManager, GetSessionDataManager, RedeemItemClothingComposer, RoomObjectCategory, UserFigureComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FurniCategory, GetFurnitureDataForRoomObject, LocalizeText, SendMessageComposer } from '../../../../../api';
import { Button, Column, LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../common';
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
    const [ gender, setGender ] = useState<string>(AvatarFigurePartType.MALE);
    const [ newFigure, setNewFigure ] = useState<string>(null);
    const { roomSession = null } = useRoom();

    const useProduct = () =>
    {
        SendMessageComposer(new RedeemItemClothingComposer(objectId));
        SendMessageComposer(new UserFigureComposer(gender, newFigure));

        onClose();
    };

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
                <div className="flex overflow-hidden gap-2">
                    <div className="flex flex-col">
                        <div className="mannequin-preview">
                            <LayoutAvatarImageView direction={ 2 } figure={ newFigure } />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between overflow-auto">
                        <Column gap={ 2 }>
                            <Text>{ LocalizeText('useproduct.widget.text.bind_clothing') }</Text>
                            <Text>{ LocalizeText('useproduct.widget.info.bind_clothing') }</Text>
                        </Column>
                        <div className="flex items-center justify-between">
                            <Button variant="danger" onClick={ onClose }>{ LocalizeText('useproduct.widget.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('useproduct.widget.bind_clothing') }</Button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
