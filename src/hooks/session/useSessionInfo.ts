import { FigureUpdateEvent, UserInfoDataParser, UserInfoEvent } from '@nitrots/nitro-renderer';
import { useCallback, useState } from 'react';
import { useBetween } from 'use-between';
import { UseMessageEventHook } from '../messages';

const useSessionInfoState = () =>
{
    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);
    const [ userFigure, setUserFigure ] = useState<string>(null);

    const onUserInfoEvent = useCallback((event: UserInfoEvent) =>
    {
        const parser = event.getParser();

        setUserInfo(parser.userInfo);
        setUserFigure(parser.userInfo.figure);
    }, []);

    UseMessageEventHook(UserInfoEvent, onUserInfoEvent);

    const onUserFigureEvent = useCallback((event: FigureUpdateEvent) =>
    {
        const parser = event.getParser();

        setUserFigure(parser.figure);
    }, []);
    
    UseMessageEventHook(FigureUpdateEvent, onUserFigureEvent);

    return { userInfo, userFigure };
}

export const useSessionInfo = () => useBetween(useSessionInfoState);
