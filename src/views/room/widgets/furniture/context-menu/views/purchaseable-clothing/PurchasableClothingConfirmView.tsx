import { RedeemItemClothingComposer, RoomObjectCategory, UserFigureComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetAvatarRenderManager, GetConnection, GetFurnitureDataForRoomObject, GetSessionDataManager, LocalizeText } from '../../../../../../../api';
import { FigureData } from '../../../../../../../components/avatar-editor/common/FigureData';
import { FurniCategory } from '../../../../../../../components/inventory/common/FurniCategory';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../../../layout';
import { AvatarImageView } from '../../../../../../shared/avatar-image/AvatarImageView';
import { useRoomContext } from '../../../../../context/RoomContext';
import { PurchasableClothingConfirmViewProps } from './PurchasableClothingConfirmView.types';

const MODE_DEFAULT: number = -1;
const MODE_PURCHASABLE_CLOTHING: number = 0;

export const PurchasableClothingConfirmView: FC<PurchasableClothingConfirmViewProps> = props =>
{
    const { objectId = -1, close = null } = props;
    const [ mode, setMode ] = useState(MODE_DEFAULT);
    const [ gender, setGender ] = useState<string>(FigureData.MALE);
    const [ newFigure, setNewFigure ] = useState<string>(null);
    const { roomSession = null } = useRoomContext();

    const useProduct = useCallback(() =>
    {
        GetConnection().send(new RedeemItemClothingComposer(objectId));
        GetConnection().send(new UserFigureComposer(gender, newFigure));

        close();
    }, [ objectId, gender, newFigure, close ]);

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
            <NitroCardContentView className="d-flex">
                <div className="row">
                    <div className="w-unset">
                        <div className="mannequin-preview">
                            <AvatarImageView figure={ newFigure } direction={ 2 } />
                        </div>
                    </div>
                    <div className="col d-flex flex-column justify-content-between">
                        <div className="d-flex flex-column">
                            <div className="text-black mb-3">{ LocalizeText('useproduct.widget.text.bind_clothing') }</div>
                            <div className="text-black">{ LocalizeText('useproduct.widget.info.bind_clothing') }</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-end w-100 h-100">
                            <button type="button" className="btn btn-danger" onClick={ close }>{ LocalizeText('useproduct.widget.cancel') }</button>
                            <button type="button" className="btn btn-primary" onClick={ useProduct }>{ LocalizeText('useproduct.widget.bind_clothing') }</button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
