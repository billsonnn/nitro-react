import { IFurnitureData, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetFurnitureDataForRoomObject, LocalizeText, RoomWidgetUseProductMessage } from '../../../../../../../api';
import { FurniCategory } from '../../../../../../../components/inventory/common/FurniCategory';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../../../layout';
import { useRoomContext } from '../../../../../context/RoomContext';
import { MonsterPlantSeedConfirmViewProps } from './MonsterPlantSeedConfirmView.types';

const MODE_DEFAULT: number = -1;
const MODE_MONSTERPLANT_SEED: number = 0;

export const MonsterPlantSeedConfirmView: FC<MonsterPlantSeedConfirmViewProps> = props =>
{
    const { objectId = -1, close = null } = props;
    const [ furniData, setFurniData ] = useState<IFurnitureData>(null);
    const [ mode, setMode ] = useState(MODE_DEFAULT);
    const { roomSession = null, widgetHandler = null } = useRoomContext();

    const useProduct = useCallback(() =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetUseProductMessage(RoomWidgetUseProductMessage.MONSTERPLANT_SEED, objectId));

        close();
    }, [ widgetHandler, objectId, close ]);

    useEffect(() =>
    {
        if(!roomSession || (objectId === -1)) return;

        const furniData = GetFurnitureDataForRoomObject(roomSession.roomId, objectId, RoomObjectCategory.FLOOR);

        if(!furniData) return;

        setFurniData(furniData);

        let mode = MODE_DEFAULT;

        switch(furniData.specialType)
        {
            case FurniCategory.MONSTERPLANT_SEED:
                mode = MODE_MONSTERPLANT_SEED;
                break;
        }

        if(mode === MODE_DEFAULT)
        {
            close();

            return;
        }

        setMode(mode);
    }, [ roomSession, objectId, close ]);

    if(mode === MODE_DEFAULT) return null;
    
    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('useproduct.widget.title.plant_seed', [ 'name' ], [ furniData.name ]) } onCloseClick={ close } />
            <NitroCardContentView className="d-flex">
                <div className="row">
                    <div className="w-unset">
                        <div className="product-preview">
                            <div className="monsterplant-image" />
                        </div>
                    </div>
                    <div className="col d-flex flex-column justify-content-between">
                        <div className="d-flex flex-column">
                            <div className="text-black mb-3">{ LocalizeText('useproduct.widget.text.plant_seed', [ 'productName' ], [ furniData.name ] ) }</div>
                            <div className="text-black">{ LocalizeText('useproduct.widget.info.plant_seed') }</div>
                        </div>
                        <div className="d-flex justify-content-between align-items-end w-100 h-100">
                            <button type="button" className="btn btn-danger" onClick={ close }>{ LocalizeText('useproduct.widget.cancel') }</button>
                            <button type="button" className="btn btn-primary" onClick={ useProduct }>{ LocalizeText('widget.monsterplant_seed.button.use') }</button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
}
