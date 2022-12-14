import { GameConfigurationData } from '@nitrots/nitro-renderer';
import { LocalizeText } from '../../../api';
import { Base, Flex } from '../../../common';
import { useGameCenter } from '../../../hooks';

export const GameListView = () => 
{
    const { games,selectedGame, setSelectedGame } = useGameCenter();

    const getClasses = (game: GameConfigurationData) => 
    {
        let classes = [ 'game-icon' ];

        if(selectedGame === game) classes.push('selected');

        return classes.join(' ');
    }
    
    const getIconImage = (game: GameConfigurationData): string => 
    {
        return `url(${ game.assetUrl }${ game.gameNameId }_icon.png)`
    }

    return <Base fullWidth className="gameList-container bg-dark p-1">
        { LocalizeText('gamecenter.game_list_title') }
        <Flex gap={ 3 }>
            { games && games.map((game,index) => 
                <Base key={ index } className={ getClasses(game) } onClick={ evt => setSelectedGame(game) } style={ { backgroundImage: getIconImage(game) } }/>
            ) }
        </Flex>
    </Base>
}
