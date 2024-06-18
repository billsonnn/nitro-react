import { AddLinkEventTracker, ILinkEventTracker, RemoveLinkEventTracker } from '@nitrots/nitro-renderer';
import { useEffect } from 'react';
import { Flex } from '../../common';
import { useGameCenter } from '../../hooks';
import { GameListView } from './views/GameListView';
import { GameStageView } from './views/GameStageView';
import { GameView } from './views/GameView';

export const GameCenterView = () =>
{
    const { isVisible, setIsVisible, games, accountStatus } = useGameCenter();

    useEffect(() =>
    {
        const toggleGameCenter = () =>
        {
            setIsVisible(prev => !prev);
        };

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

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    if(!isVisible || !games || !accountStatus) return;

    return <Flex className="top-0 bottom-0 start-0 end-0 bg-black" justifyContent="center" position="absolute">
        <Flex column className="game-center-main">
            <GameView/>
            <GameListView />
        </Flex>
        <GameStageView />
    </Flex>;
};
