import { GameConfigurationData } from '@nitrots/nitro-renderer';
import { LocalizeText } from '../../../api';
import { useGameCenter } from '../../../hooks';

export const GameListView = () =>
{
    const { games, selectedGame, setSelectedGame } = useGameCenter();

    const getClasses = (game: GameConfigurationData) =>
    {
        let classes = [ 'game-icon' ];

        if(selectedGame === game) classes.push('selected');

        return classes.join(' ');
    };

    const getIconImage = (game: GameConfigurationData): string =>
    {
        return `url(${ game.assetUrl }${ game.gameNameId }_icon.png)`;
    };

    return <div className="gameList-container bg-dark p-1 w-full">
        { LocalizeText('gamecenter.game_list_title') }
        <div className="flex gap-3">
            { games && games.map((game, index) =>
                <div key={ index } className={ getClasses(game) } style={ { backgroundImage: getIconImage(game) } } onClick={ evt => setSelectedGame(game) } />
            ) }
        </div>
    </div>;
};
