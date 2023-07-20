import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { Flex } from '../../common';
import { useGameCenter } from '../../hooks';
import { GameListView } from './views/GameListView';
import { GameStageView } from './views/GameStageView';
import { GameView } from './views/GameView';

export const GameCenterView = () => 
{
    const{ isVisible, setIsVisible, games, accountStatus } = useGameCenter();

    useEffect(() =>
    {
        const toggleGameCenter = () =>
        {
            setIsVisible(prev => !prev);
        }

        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const value = url.split('/');
                
                switch(value[1]) 
                {
                    case 'toggle':
                        toggleGameCenter();
                        break;
                }
            },
            eventUrlPrefix: 'games/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ ]);

    if(!isVisible || !games || !accountStatus) return;
    
    return <Flex position="absolute" className="top-0 bottom-0 start-0 end-0 bg-black" justifyContent="center">
        <Flex className="game-center-main" column>
            <GameView/>
            <GameListView />
        </Flex>
        <GameStageView />
    </Flex>
}
