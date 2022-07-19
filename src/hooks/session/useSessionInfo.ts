import { FigureUpdateEvent, UserInfoDataParser, UserInfoEvent } from '@nitrots/nitro-renderer';
import { useState } from 'react';
import { useBetween } from 'use-between';
import { useMessageEvent } from '../events';

const useSessionInfoState = () =>
{
    const [ userInfo, setUserInfo ] = useState<UserInfoDataParser>(null);
    const [ userFigure, setUserFigure ] = useState<string>(null);

    useMessageEvent<UserInfoEvent>(UserInfoEvent, event =>
    {
        const parser = event.getParser();

        setUserInfo(parser.userInfo);
        setUserFigure(parser.userInfo.figure);
    });
    
    useMessageEvent<FigureUpdateEvent>(FigureUpdateEvent, event =>
    {
        const parser = event.getParser();

        setUserFigure(parser.figure);
    });

    return { userInfo, userFigure };
}

export const useSessionInfo = () => useBetween(useSessionInfoState);
