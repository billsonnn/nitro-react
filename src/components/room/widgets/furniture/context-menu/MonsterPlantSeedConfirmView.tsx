import { IFurnitureData, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FurniCategory, GetFurnitureDataForRoomObject, LocalizeText } from '../../../../../api';
import { Button, Column, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../common';
import { useRoom } from '../../../../../hooks';

interface MonsterPlantSeedConfirmViewProps
{
    objectId: number;
    onClose: () => void;
}

const MODE_DEFAULT: number = -1;
const MODE_MONSTERPLANT_SEED: number = 0;

export const MonsterPlantSeedConfirmView: FC<MonsterPlantSeedConfirmViewProps> = props =>
{
    const { objectId = -1, onClose = null } = props;
    const [ furniData, setFurniData ] = useState<IFurnitureData>(null);
    const [ mode, setMode ] = useState(MODE_DEFAULT);
    const { roomSession = null } = useRoom();

    const useProduct = () =>
    {
        roomSession.useMultistateItem(objectId);

        onClose();
    };

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
            onClose();

            return;
        }

        setMode(mode);
    }, [ roomSession, objectId, onClose ]);

    if(mode === MODE_DEFAULT) return null;

    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('useproduct.widget.title.plant_seed', [ 'name' ], [ furniData.name ]) } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <div className="flex gap-2 overflow-hidden">
                    <div className="flex flex-col">
                        <div className="product-preview">
                            <div className="monsterplant-image" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between overflow-auto">
                        <Column gap={ 2 }>
                            <Text>{ LocalizeText('useproduct.widget.text.plant_seed', [ 'productName' ], [ furniData.name ]) }</Text>
                            <Text>{ LocalizeText('useproduct.widget.info.plant_seed') }</Text>
                        </Column>
                        <div className="flex items-center justify-between">
                            <Button variant="danger" onClick={ onClose }>{ LocalizeText('useproduct.widget.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('widget.monsterplant_seed.button.use') }</Button>
                        </div>
                    </div>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
