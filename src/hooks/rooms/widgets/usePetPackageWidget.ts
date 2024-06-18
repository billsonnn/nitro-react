import { GetRoomEngine, OpenPetPackageMessageComposer, RoomObjectCategory, RoomSessionPetPackageEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { useNitroEvent } from '../../events';

const usePetPackageWidgetState = () =>
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ objectId, setObjectId ] = useState<number>(-1);
    const [ objectType, setObjectType ] = useState<string>('');
    const [ petName, setPetName ] = useState<string>('');
    const [ errorResult, setErrorResult ] = useState<string>('');

    const onClose = () =>
    {
        setErrorResult('');
        setPetName('');
        setObjectType('');
        setObjectId(-1);
        setIsVisible(false);
    };

    const onConfirm = () =>
    {
        SendMessageComposer(new OpenPetPackageMessageComposer(objectId, petName));
    };

    const onChangePetName = (petName: string) =>
    {
        setPetName(petName);
        if(errorResult.length > 0) setErrorResult('');
    };

    const getErrorResultForCode = (errorCode: number) =>
    {
        if(!errorCode || errorCode === 0) return;

        switch(errorCode)
        {
            case 1:
                return LocalizeText('catalog.alert.petname.long');
            case 2:
                return LocalizeText('catalog.alert.petname.short');
            case 3:
                return LocalizeText('catalog.alert.petname.chars');
            case 4:
            default:
                return LocalizeText('catalog.alert.petname.bobba');
        }
    };

    useNitroEvent<RoomSessionPetPackageEvent>(RoomSessionPetPackageEvent.RSOPPE_OPEN_PET_PACKAGE_REQUESTED, event =>
    {
        if(!event) return;

        const roomObject = GetRoomEngine().getRoomObject(event.session.roomId, event.objectId, RoomObjectCategory.FLOOR);

        setObjectId(event.objectId);
        setObjectType(roomObject.type);
        setIsVisible(true);
    });

    useNitroEvent<RoomSessionPetPackageEvent>(RoomSessionPetPackageEvent.RSOPPE_OPEN_PET_PACKAGE_RESULT, event =>
    {
        if(!event) return;

        if(event.nameValidationStatus === 0) onClose();

        if(event.nameValidationStatus !== 0) setErrorResult(getErrorResultForCode(event.nameValidationStatus));
    });

    return { isVisible, errorResult, petName, objectType, onChangePetName, onConfirm, onClose };
};

export const usePetPackageWidget = usePetPackageWidgetState;
