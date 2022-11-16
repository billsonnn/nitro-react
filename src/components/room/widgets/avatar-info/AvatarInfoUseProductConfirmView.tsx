import { IFurnitureData, IPetCustomPart, IRoomUserData, PetCustomPart, PetFigureData, RoomObjectCategory, RoomObjectVariable } from '@nitrots/nitro-renderer';
import { FC, useEffect, useMemo, useState } from 'react';
import { FurniCategory, GetFurnitureDataForRoomObject, GetRoomEngine, LocalizeText, UseProductItem } from '../../../../api';
import { Base, Button, Column, Flex, LayoutPetImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useRoom } from '../../../../hooks';

interface AvatarInfoUseProductConfirmViewProps
{
    item: UseProductItem;
    onClose: () => void;
}

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
    const { item = null, onClose = null } = props;
    const [ mode, setMode ] = useState(_Str_5091);
    const [ petData, setPetData ] = useState<IRoomUserData>(null);
    const [ furniData, setFurniData ] = useState<IFurnitureData>(null);
    const { roomSession = null } = useRoom();

    const selectRoomObject = () =>
    {
        if(!petData) return;

        GetRoomEngine().selectRoomObject(roomSession.roomId, petData.roomIndex, RoomObjectCategory.UNIT);
    }

    const useProduct = () =>
    {
        roomSession.usePetProduct(item.requestRoomObjectId, petData.webID);

        onClose();
    }

    const getPetImage = useMemo(() =>
    {
        if(!petData || !furniData) return null;

        const petFigureData = new PetFigureData(petData.figure);
        const customParts = furniData.customParams.split(' ');
        const petIndex = parseInt(customParts[0]);

        switch(furniData.specialType)
        {
            case FurniCategory.PET_SHAMPOO: {
                if(customParts.length < 2) return null;

                const currentPalette = GetRoomEngine().getPetColorResult(petIndex, petFigureData.paletteId);
                const possiblePalettes = GetRoomEngine().getPetColorResultsForTag(petIndex, customParts[1]);

                let paletteId = -1;

                for(const result of possiblePalettes)
                {
                    if(result.breed === currentPalette.breed)
                    {
                        paletteId = parseInt(result.id);

                        break;
                    }
                }

                return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ paletteId } petColor={ petFigureData.color } customParts={ petFigureData.customParts } direction={ 2 } />
            }
            case FurniCategory.PET_CUSTOM_PART: {
                if(customParts.length < 4) return null;

                const newCustomParts: IPetCustomPart[] = [];

                const _local_6 = customParts[1].split(',').map(piece => parseInt(piece));
                const _local_7 = customParts[2].split(',').map(piece => parseInt(piece));
                const _local_8 = customParts[3].split(',').map(piece => parseInt(piece));

                let _local_10 = 0;

                while(_local_10 < _local_6.length)
                {
                    const _local_13 = _local_6[_local_10];
                    const _local_15 = petFigureData.getCustomPart(_local_13);

                    let _local_12 = _local_8[_local_10];

                    if(_local_15 != null) _local_12 = _local_15.paletteId;

                    newCustomParts.push(new PetCustomPart(_local_13, _local_7[_local_10], _local_12));

                    _local_10++;
                }

                return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } petColor={ petFigureData.color } customParts={ newCustomParts } direction={ 2 } />;
            }
            case FurniCategory.PET_CUSTOM_PART_SHAMPOO: {
                if(customParts.length < 3) return null;

                const newCustomParts: IPetCustomPart[] = [];

                const _local_6 = customParts[1].split(',').map(piece => parseInt(piece));
                const _local_8 = customParts[2].split(',').map(piece => parseInt(piece));

                let _local_10 = 0;

                while(_local_10 < _local_6.length)
                {
                    const _local_13 = _local_6[_local_10];
                    const _local_15 = petFigureData.getCustomPart(_local_13);

                    let _local_14 = -1;

                    if(_local_15 != null) _local_14 = _local_15.partId;

                    newCustomParts.push(new PetCustomPart(_local_6[_local_10], _local_14, _local_8[_local_10]));

                    _local_10++;
                }

                return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } petColor={ petFigureData.color } customParts={ newCustomParts } direction={ 2 } />;
            }
            case FurniCategory.PET_SADDLE: {
                if(customParts.length < 4) return null;

                const newCustomParts: IPetCustomPart[] = [];

                const _local_6 = customParts[1].split(',').map(piece => parseInt(piece));
                const _local_7 = customParts[2].split(',').map(piece => parseInt(piece));
                const _local_8 = customParts[3].split(',').map(piece => parseInt(piece));

                let _local_10 = 0;

                while(_local_10 < _local_6.length)
                {
                    newCustomParts.push(new PetCustomPart(_local_6[_local_10], _local_7[_local_10], _local_8[_local_10]));

                    _local_10++;
                }

                for(const _local_21 of petFigureData.customParts)
                {
                    if(_local_6.indexOf(_local_21.layerId) === -1)
                    {
                        newCustomParts.push(_local_21);
                    }
                }

                return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } petColor={ petFigureData.color } customParts={ newCustomParts } direction={ 2 } />;
            }
            case FurniCategory.MONSTERPLANT_REBREED:
            case FurniCategory.MONSTERPLANT_REVIVAL:
            case FurniCategory.MONSTERPLANT_FERTILIZE: {
                let posture = 'rip';

                const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, petData.roomIndex, RoomObjectCategory.UNIT);

                if(roomObject)
                {
                    posture = roomObject.model.getValue<string>(RoomObjectVariable.FIGURE_POSTURE);

                    if(posture === 'rip')
                    {
                        const level = petData.petLevel;

                        if(level < 7) posture = `grw${ level }`;
                        else posture = 'std';
                    }
                }

                return <LayoutPetImageView typeId={ petFigureData.typeId } paletteId={ petFigureData.paletteId } petColor={ petFigureData.color } customParts={ petFigureData.customParts } posture={ posture } direction={ 2 } />;
            }
        }
    }, [ petData, furniData, roomSession ]);

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
            case FurniCategory.PET_SHAMPOO:
                mode = _Str_11906;
                break;
            case FurniCategory.PET_CUSTOM_PART:
                mode = _Str_11214;
                break;
            case FurniCategory.PET_CUSTOM_PART_SHAMPOO:
                mode = _Str_11733;
                break;
            case FurniCategory.PET_SADDLE:
                mode = _Str_11369;
                break;
            case FurniCategory.MONSTERPLANT_REVIVAL:
                mode = _Str_8759;
                break;
            case FurniCategory.MONSTERPLANT_REBREED:
                mode = _Str_8432;
                break;
            case FurniCategory.MONSTERPLANT_FERTILIZE:
                mode = _Str_9653;
                break;
        }

        setMode(mode);
    }, [ roomSession, item ]);

    if(!petData) return null;

    return (
        <NitroCardView className="nitro-use-product-confirmation">
            <NitroCardHeaderView headerText={ LocalizeText('useproduct.widget.title', [ 'name' ], [ petData.name ]) } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <Flex gap={ 2 } overflow="hidden">
                    <Column>
                        <Base pointer className="product-preview" onClick={ selectRoomObject }>
                            { getPetImage }
                        </Base>
                    </Column>
                    <Column justifyContent="between" overflow="auto">
                        <Column gap={ 2 }>
                            { (mode === _Str_11906) &&
                                <>
                                    <Text>{ LocalizeText('useproduct.widget.text.shampoo', [ 'productName' ], [ furniData.name ] ) }</Text>
                                    <Text>{ LocalizeText('useproduct.widget.info.shampoo') }</Text>
                                </> }
                            { (mode === _Str_11214) &&
                                <>
                                    <Text>{ LocalizeText('useproduct.widget.text.custompart', [ 'productName' ], [ furniData.name ] ) }</Text>
                                    <Text>{ LocalizeText('useproduct.widget.info.custompart') }</Text>
                                </> }
                            { (mode === _Str_11733) &&
                                <>
                                    <Text>{ LocalizeText('useproduct.widget.text.custompartshampoo', [ 'productName' ], [ furniData.name ] ) }</Text>
                                    <Text>{ LocalizeText('useproduct.widget.info.custompartshampoo') }</Text>
                                </> }
                            { (mode === _Str_11369) &&
                                <>
                                    <Text>{ LocalizeText('useproduct.widget.text.saddle', [ 'productName' ], [ furniData.name ] ) }</Text>
                                    <Text>{ LocalizeText('useproduct.widget.info.saddle') }</Text>
                                </> }
                            { (mode === _Str_8759) &&
                                <>
                                    <Text>{ LocalizeText('useproduct.widget.text.revive_monsterplant', [ 'productName' ], [ furniData.name ] ) }</Text>
                                    <Text>{ LocalizeText('useproduct.widget.info.revive_monsterplant') }</Text>
                                </> }
                            { (mode === _Str_8432) &&
                                <>
                                    <Text>{ LocalizeText('useproduct.widget.text.rebreed_monsterplant', [ 'productName' ], [ furniData.name ] ) }</Text>
                                    <Text>{ LocalizeText('useproduct.widget.info.rebreed_monsterplant') }</Text>
                                </> }
                            { (mode === _Str_9653) &&
                                <>
                                    <Text>{ LocalizeText('useproduct.widget.text.fertilize_monsterplant', [ 'productName' ], [ furniData.name ] ) }</Text>
                                    <Text>{ LocalizeText('useproduct.widget.info.fertilize_monsterplant') }</Text>
                                </> }
                        </Column>
                        <Flex alignItems="center" justifyContent="between">
                            <Button variant="danger" onClick={ onClose }>{ LocalizeText('useproduct.widget.cancel') }</Button>
                            <Button variant="success" onClick={ useProduct }>{ LocalizeText('useproduct.widget.use') }</Button>
                        </Flex>
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    )
}
