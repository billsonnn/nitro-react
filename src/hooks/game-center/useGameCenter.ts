import { Game2AccountGameStatusMessageEvent, Game2AccountGameStatusMessageParser, GameConfigurationData, GameListMessageEvent, GameStatusMessageEvent, GetGameListMessageComposer, LoadGameUrlEvent } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { SendMessageComposer, VisitDesktop } from '../../api';
import { useMessageEvent } from '../events';

const useGameCenterState = () => 
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false);
    const [ games, setGames ] = useState<GameConfigurationData[]>(null);
    const [ selectedGame, setSelectedGame ] = useState<GameConfigurationData>(null);
    const [ accountStatus, setAccountStatus ] = useState<Game2AccountGameStatusMessageParser>(null);
    const [ gameOffline, setGameOffline ] = useState<boolean>(false);
    const [ gameURL, setGameURL ] = useState<string>(null);

    useMessageEvent<GameListMessageEvent>(GameListMessageEvent, event => 
    {
        let parser = event.getParser();

        if(!parser || parser && !parser.games.length) return;

        setSelectedGame(parser.games[0]);

        setGames(parser.games);
    });

    useMessageEvent<Game2AccountGameStatusMessageEvent>(Game2AccountGameStatusMessageEvent, event => 
    {
        let parser = event.getParser();

        if(!parser) return;

        setAccountStatus(parser);
    });

    useMessageEvent<GameStatusMessageEvent>(GameStatusMessageEvent, event => 
    {
        let parser = event.getParser();

        if(!parser) return;

        setGameOffline(parser.isInMaintenance);
    })

    useMessageEvent<LoadGameUrlEvent>(LoadGameUrlEvent, event => 
    {
        let parser = event.getParser();

        if(!parser) return;

        switch(parser.gameTypeId) 
        {
            case 2:
                return console.log('snowwar')
            default:
                return setGameURL(parser.url);
        }
    });

    useEffect(()=>
    {
        if(isVisible) 
        {
            SendMessageComposer(new GetGameListMessageComposer());
            VisitDesktop();
        }
        else 
        {
            // dispose or wtv
        }
    },[ isVisible ]);

    return {
        isVisible, setIsVisible,
        games,
        accountStatus,
        selectedGame, setSelectedGame,
        gameOffline,
        gameURL, setGameURL
    }
}

export const useGameCenter = () => useBetween(useGameCenterState);
