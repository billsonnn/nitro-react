import { IFurnitureData, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetFurnitureDataForRoomObject, LocalizeText, RoomWidgetUseProductMessage } from '../../../../../api';
import { Base, Button, Column, Flex, Text } from '../../../../../common';
import { FurniCategory } from '../../../../../components/inventory/common/FurniCategory';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';

interface MonsterPlantSeedConfirmViewProps
{
    objectId: number;
    close: () => void;
}

const MODE_DEFAULT: number = -1;
const MODE_MONSTERPLANT_SEED: number = 0;

export const MonsterPlantSeedConfirmView: FC<MonsterPlantSeedConfirmViewProps> = props =>
{
    const { objectId = -1, close = null } = props;
    const [ furniData, setFurniData ] = useState<IFurnitureData>(null);
    const [ mode, setMode ] = useState(MODE_DEFAULT);
    const { roomSession = null, widgetHandler = null } = useRoomContext();

    const useProduct = () =>
    {
        widgetHandler.processWidgetMessage(new RoomWidgetUseProductMessage(RoomWidgetUseProductMessage.MONSTERPLANT_SEED, objectId));

        close();
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
            close();

            return;
        }

        setMode(mode);
    }, [ roomSession, objectId, close ]);

    if(mode === MODE_DEFAULT) return null;
    
    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('useproduct.widget.title.plant_seed', [ 'name' ], [ furniData.name ]) } onCloseClick={ close } />
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
                            <Button variant="danger" onClick={ close }>{ LocalizeText('useproduct.widget.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('widget.monsterplant_seed.button.use') }</Button>
                        </Flex>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
