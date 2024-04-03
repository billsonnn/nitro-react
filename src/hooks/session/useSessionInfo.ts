import { FigureUpdateEvent, RoomUnitChatStyleComposer, UserInfoDataParser, UserInfoEvent, UserMottoComposer, UserSettingsEvent } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { GetConfiguration, GetLocalStorage, GetSessionDataManager, SendMessageComposer } from '../../api';
import { useMessageEvent } from '../events';
import { useLocalStorage } from '../useLocalStorage';

const useSessionInfoState = () =>
{
    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);
    const [ userFigure, setUserFigure ] = useState<string>(null);
    const [ userName, setUserName ] = useState<string>(null);
    const [ motto, setMotto ] = useState<string>('');
    const [ chatStyleId, setChatStyleId ] = useState<number>(0);
    const [ userRespectRemaining, setUserRespectRemaining ] = useState<number>(0);
    const [ petRespectRemaining, setPetRespectRemaining ] = useState<number>(0);
    const [ screenSize, setScreenSize ] = useLocalStorage('nitro.screensize', { width: window.innerWidth, height: window.innerHeight });

    const updateChatStyleId = (styleId: number) =>
    {
        setChatStyleId(styleId);

        SendMessageComposer(new RoomUnitChatStyleComposer(styleId));
    }

    const respectUser = (userId: number) =>
    {
        GetSessionDataManager().giveRespect(userId);

        setUserRespectRemaining(GetSessionDataManager().respectsLeft);
    }

    const respectPet = (petId: number) =>
    {
        GetSessionDataManager().givePetRespect(petId);

        setPetRespectRemaining(GetSessionDataManager().respectsPetLeft);
    }

    const saveMotto = (motto: string) =>
    {
        if (motto.length > GetConfiguration<number>('motto.max.length', 38)) return;
        setMotto(motto);
        SendMessageComposer(new UserMottoComposer(motto))
    }

    useMessageEvent<UserInfoEvent>(UserInfoEvent, event =>
    {
        const parser = event.getParser();

        setUserInfo(parser.userInfo);
        setUserName(parser.userInfo.username);
        setMotto(parser.userInfo.motto);
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

    useEffect(() =>
    {
        const currentScreenSize = <{ width: number, height: number }>GetLocalStorage('nitro.screensize');

        if(currentScreenSize && ((currentScreenSize.width !== window.innerWidth) || (currentScreenSize.height !== window.innerHeight)))
        {
            let i = window.localStorage.length;

            while(i > 0)
            {
                const key = window.localStorage.key(i);
    
                if(key && key.startsWith('nitro.window')) window.localStorage.removeItem(key);
    
                i--;
            }
        }

        const onResize = (event: UIEvent) => setScreenSize({ width: window.innerWidth, height: window.innerHeight });

        window.addEventListener('resize', onResize);

        return () =>
        {
            window.removeEventListener('resize', onResize);
        }
    }, [ setScreenSize ]);

    return { userInfo, userFigure, userName,motto, chatStyleId, userRespectRemaining, petRespectRemaining, respectUser, respectPet, updateChatStyleId, setMotto, saveMotto };
}

export const useSessionInfo = () => useBetween(useSessionInfoState);
