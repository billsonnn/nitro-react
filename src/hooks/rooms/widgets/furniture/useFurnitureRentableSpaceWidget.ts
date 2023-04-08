import { RentableSpaceCancelRentMessageComposer, RentableSpaceRentMessageComposer, RentableSpaceStatusMessageEvent, RentableSpaceStatusMessageParser, RoomEngineTriggerWidgetEvent, RoomWidgetEnum } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { GetRoomEngine, GetSessionDataManager, LocalizeText, SendMessageComposer } from '../../../../api';
import { useMessageEvent, useRoomEngineEvent } from '../../../events';
import { useNavigator } from '../../../navigator';
import { useNotification } from '../../../notification';
import { useFurniRemovedEvent } from '../../engine';

const useFurnitureRentableSpaceWidgetState = () =>
{
    const [ renter, setRenter ] = useState<RentableSpaceStatusMessageParser>(null);
    const [ itemId, setItemId ] = useState<number>(-1);
    const [ category, setCategory ] = useState<number>(-1);
    const { navigatorData = null } = useNavigator();
    const { simpleAlert } = useNotification();

    const isRoomOwner = GetSessionDataManager().userName === navigatorData.enteredGuestRoom.ownerName;    

    const onClose = () =>
    {
        setItemId(-1);
        setCategory(-1);
        setRenter(null);
    }

    const onRent = () =>
    {
        if (!itemId) return;
        
        SendMessageComposer(new RentableSpaceRentMessageComposer(itemId));
    }

    const onCancelRent = () =>
    {
        if (!itemId) return;
        
        SendMessageComposer(new RentableSpaceCancelRentMessageComposer(itemId));
        onClose();
    }

    const getRentErrorCode = (code: number) =>
    {
        let errorAlert = '';

        switch(code)
        {
            case RentableSpaceStatusMessageParser.SPACE_ALREADY_RENTED:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_already_rented');
                break;
            case RentableSpaceStatusMessageParser.SPACE_EXTEND_NOT_RENTED:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_not_rented');
                break;
            case RentableSpaceStatusMessageParser.SPACE_EXTEND_NOT_RENTED_BY_YOU:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_not_rented_by_you');
                break;
            case RentableSpaceStatusMessageParser.CAN_RENT_ONLY_ONE_SPACE:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_can_rent_only_one_space');
                break;
            case RentableSpaceStatusMessageParser.NOT_ENOUGH_CREDITS:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_not_enough_credits');
                break;
            case RentableSpaceStatusMessageParser.NOT_ENOUGH_PIXELS:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_not_enough_duckets');
                break;
            case RentableSpaceStatusMessageParser.CANT_RENT_NO_PERMISSION:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_no_permission');
                break;
            case RentableSpaceStatusMessageParser.CANT_RENT_NO_HABBO_CLUB:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_no_habboclub');
                break;
            case RentableSpaceStatusMessageParser.CANT_RENT:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_disabled');
                break;
            case RentableSpaceStatusMessageParser.CANT_RENT_GENERIC:
                errorAlert = LocalizeText('rentablespace.widget.error_reason_generic');
                break;
        }
        
        onClose();
        return simpleAlert(errorAlert);
    }

    useRoomEngineEvent<RoomEngineTriggerWidgetEvent>(RoomEngineTriggerWidgetEvent.OPEN_WIDGET, event =>
    {
        if (event.widget !== RoomWidgetEnum.RENTABLESPACE) return;
        
        const roomObject = GetRoomEngine().getRoomObject(event.roomId, event.objectId, event.category);
        
        if(!roomObject) return;

        setItemId(roomObject.id);
        setCategory(event.category);
    });

    useFurniRemovedEvent(((itemId !== -1) && (category !== -1)), event =>
    {
        if((event.id !== itemId) || (event.category !== category)) return;

        onCancelRent();
    });

    useMessageEvent<RentableSpaceStatusMessageEvent>(RentableSpaceStatusMessageEvent, event =>
    {
        const parser = event.getParser();

        if (!parser) return;
        
        if (parser.canRentErrorCode !== 0 && (!isRoomOwner || !GetSessionDataManager().isModerator) || (parser.renterName === '' && parser.canRentErrorCode !== 0)) return getRentErrorCode(parser.canRentErrorCode);
        
        setRenter(parser);
    });

    return { renter, isRoomOwner, onRent, onCancelRent, onClose };
}

export const useFurnitureRentableSpaceWidget = useFurnitureRentableSpaceWidgetState;
