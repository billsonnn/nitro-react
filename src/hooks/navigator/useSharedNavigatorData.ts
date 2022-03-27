import { useState } from 'react';
import { useBetween } from 'use-between';
import { INavigatorData } from '../../api';

const useNavigatorData = () =>
{
    return useState<INavigatorData>({
        settingsReceived: false,
        homeRoomId: 0,
        enteredGuestRoom: null,
        currentRoomOwner: false,
        currentRoomId: 0,
        currentRoomIsStaffPick: false,
        createdFlatId: 0,
        avatarId: 0,
        roomPicker: false,
        eventMod: false,
        currentRoomRating: 0,
        canRate: true
    });
}

export const useSharedNavigatorData = () => useBetween(useNavigatorData);
