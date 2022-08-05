import { IFurnitureData, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FurniCategory, GetFurnitureDataForRoomObject, LocalizeText } from '../../../../../api';
import { Base, Button, Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../common';
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
    }

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
                <Flex gap={ 2 } overflow="hidden">
                    <Column>
                        <Base className="product-preview">
                            <Base className="monsterplant-image" />
                        </Base>
                    </Column>
                    <Column justifyContent="between" overflow="auto">
                        <Column gap={ 2 }>
                            <Text>{ LocalizeText('useproduct.widget.text.plant_seed', [ 'productName' ], [ furniData.name ] ) }</Text>
                            <Text>{ LocalizeText('useproduct.widget.info.plant_seed') }</Text>
                        </Column>
                        <Flex alignItems="center" justifyContent="between">
                            <Button variant="danger" onClick={ onClose }>{ LocalizeText('useproduct.widget.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('widget.monsterplant_seed.button.use') }</Button>
                        </Flex>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
