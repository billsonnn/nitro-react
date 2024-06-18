import { FigureUpdateEvent, GetSessionDataManager, RoomUnitChatStyleComposer, UserInfoDataParser, UserInfoEvent, UserSettingsEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { useBetween } from 'use-between';
import { SendMessageComposer } from '../../api';
import { useMessageEvent } from '../events';

const useSessionInfoState = () =>
{
    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);
    const [ userFigure, setUserFigure ] = useState<string>(null);
    const [ chatStyleId, setChatStyleId ] = useState<number>(0);
    const [ userRespectRemaining, setUserRespectRemaining ] = useState<number>(0);
    const [ petRespectRemaining, setPetRespectRemaining ] = useState<number>(0);

    const updateChatStyleId = (styleId: number) =>
    {
        setChatStyleId(styleId);

        SendMessageComposer(new RoomUnitChatStyleComposer(styleId));
    };

    const respectUser = (userId: number) =>
    {
        GetSessionDataManager().giveRespect(userId);

        setUserRespectRemaining(GetSessionDataManager().respectsLeft);
    };

    const respectPet = (petId: number) =>
    {
        GetSessionDataManager().givePetRespect(petId);

        setPetRespectRemaining(GetSessionDataManager().respectsPetLeft);
    };

    useMessageEvent<UserInfoEvent>(UserInfoEvent, event =>
    {
        const parser = event.getParser();

        setUserInfo(parser.userInfo);
        setUserFigure(parser.userInfo.figure);
        setUserRespectRemaining(parser.userInfo.respectsRemaining);
        setPetRespectRemaining(parser.userInfo.respectsPetRemaining);
    });

    useMessageEvent<FigureUpdateEvent>(FigureUpdateEvent, event =>
    {
        const parser = event.getParser();

        setUserFigure(parser.figure);
    });

    useMessageEvent<UserSettingsEvent>(UserSettingsEvent, event =>
    {
        const parser = event.getParser();

        setChatStyleId(parser.chatType);
    });

    return { userInfo, userFigure, chatStyleId, userRespectRemaining, petRespectRemaining, respectUser, respectPet, updateChatStyleId };
};

export const useSessionInfo = () => useBetween(useSessionInfoState);
