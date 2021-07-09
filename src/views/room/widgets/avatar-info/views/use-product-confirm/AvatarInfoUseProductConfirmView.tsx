import { IFurnitureData, RoomObjectCategory, RoomUserData } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetFurnitureDataForRoomObject } from '../../../../../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../../layout';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { FurniCategory } from '../../../../../inventory/common/FurniCategory';
import { useRoomContext } from '../../../../context/RoomContext';
import { RoomWidgetUseProductMessage } from '../../../../messages';
import { AvatarInfoUseProductConfirmViewProps } from './AvatarInfoUseProductConfirmView.types';

const _Str_5091: number = -1;
const _Str_11906: number = 0;
const _Str_11214: number = 1;
const _Str_11733: number = 2;
const _Str_11369: number = 3;
const _Str_8759: number = 4;
const _Str_8432: number = 5;
const _Str_9653: number = 6;

export const AvatarInfoUseProductConfirmView: FC<AvatarInfoUseProductConfirmViewProps> = props =>
{
    const { item = null, close = null } = props;
    const [ mode, setMode ] = useState(_Str_5091);
    const [ petData, setPetData ] = useState<RoomUserData>(null);
    const [ furniData, setFurniData ] = useState<IFurnitureData>(null);
    const { roomSession = null, widgetHandler = null } = useRoomContext();

    const useProduct = useCallback(() =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetUseProductMessage(RoomWidgetUseProductMessage.PET_PRODUCT, item.requestRoomObjectId, petData.webID));
    }, [ widgetHandler, item, petData ]);

    useEffect(() =>
    {
        const userData = roomSession.userDataManager.getUserDataByIndex(item.id);

        setPetData(userData);

        const furniData = GetFurnitureDataForRoomObject(roomSession.roomId, item.requestRoomObjectId, RoomObjectCategory.FLOOR);

        if(!furniData) return;

        setFurniData(furniData);

        let mode = _Str_5091;

        switch(furniData.specialType)
        {
            case FurniCategory._Str_7696:
                mode = _Str_11906;
                break;
            case FurniCategory._Str_7297:
                mode = _Str_11214;
                break;
            case FurniCategory._Str_7954:
                mode = _Str_11733;
                break;
            case FurniCategory._Str_6096:
                mode = _Str_11369;
                break;
            case FurniCategory._Str_6915:
                mode = _Str_8759;
                break;
            case FurniCategory._Str_8726:
                mode = _Str_8432;
                break;
            case FurniCategory._Str_9449:
                mode = _Str_9653;
                break;
        }

        setMode(mode);
    }, [ roomSession, item ]);

    return (
        <NitroCardView>
            <NitroCardHeaderView headerText={ LocalizeText('useproduct.widget.title', [ 'name' ], [ petData.name ]) } onCloseClick={ close } />
            <NitroCardContentView>
                <button type="button" className="btn btn-primary" onClick={ useProduct }>Use it</button>
            </NitroCardContentView>
        </NitroCardView>
    )
}
