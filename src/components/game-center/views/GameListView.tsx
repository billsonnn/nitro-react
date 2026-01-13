import { LocalizeText } from "../../../api"
import { useGameCenter } from "../../../hooks"

export const GameListView = () => 
{
    const { games,selectedGame, setSelectedGame } = useGameCenter()

    const getClasses = (game: any) => 
    {
        let classes = [ "flex items-center justify-center size-[83px] bg-[url('/client-assets/images/gamecenter/game-item-bg.png')] bg-center bg-no-repeat cursor-pointer" ]

        if(selectedGame === game) classes.push("bg-[url('/client-assets/images/gamecenter/game-item-selected-bg.png')]")

        return classes.join(" ")
    }
    
    const getIconImage = (game: any): string => 
    {
        return `url(${game.assetUrl }game_icon.png)`
    }

    return <div className="bg-[#253235] px-px pt-2.5">
        <div className="relative border border-[#7c8485] outline outline-1 outline-[#161e1f]">
            <p className="absolute -top-2.5 left-3 z-10 bg-[#253235] px-1.5 text-[13px] font-semibold text-white [text-shadow:_0_1px_0_#253235]">{ LocalizeText("gamecenter.game_list_title") }</p>
            <div className="flex gap-2 px-[38px] pb-3 pt-4">
                { games && games.map((game: any, index: number) => 
                    <div key={ index } className={ getClasses(game) } onClick={ evt => setSelectedGame(game) }>
                        <div className="size-full bg-center bg-no-repeat" style={ { backgroundImage: getIconImage(game) } } />
                    </div>
                ) }
            </div>
        </div>
    </div>
}
