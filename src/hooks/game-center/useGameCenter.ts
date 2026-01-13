import { Game2AccountGameStatusMessageEvent, Game2AccountGameStatusMessageParser, GameListMessageEvent, GameStatusMessageEvent, GetGameListMessageComposer, LoadGameUrlEvent } from "@nitrots/nitro-renderer"
import { useEffect, useState } from "react"
import { useBetween } from "use-between"
import { GetConfiguration, SendMessageComposer } from "../../api"
import { useMessageEvent } from "../events"

const useGameCenterState = () => 
{
    const [ isVisible, setIsVisible ] = useState<boolean>(false)
    const [ games, setGames ] = useState(null)
    const [ selectedGame, setSelectedGame ] = useState(null)
    const [ accountStatus, setAccountStatus ] = useState<Game2AccountGameStatusMessageParser>(null)
    const [ gameOffline, setGameOffline ] = useState<boolean>(false)
    const [ gameURL, setGameURL ] = useState<string>(null)

    const gameList = GetConfiguration<string[]>("illumina.gamecenter.game_list")

    useMessageEvent<GameListMessageEvent>(GameListMessageEvent, event => 
    {
        if(!gameList.filter((game: any) => game.enabled).length) return

        setSelectedGame(gameList.filter((game: any) => game.enabled)[0])

        setGames(gameList.filter((game: any) => game.enabled))
    })

    useMessageEvent<Game2AccountGameStatusMessageEvent>(Game2AccountGameStatusMessageEvent, event => 
    {
        let parser = event.getParser()

        if(!parser) return

        setAccountStatus(parser)
    })

    useMessageEvent<GameStatusMessageEvent>(GameStatusMessageEvent, event => 
    {
        let parser = event.getParser()

        if(!parser) return

        setGameOffline(parser.isInMaintenance)
    })

    useMessageEvent<LoadGameUrlEvent>(LoadGameUrlEvent, event => 
    {
        let parser = event.getParser()

        if(!parser) return

        switch(parser.gameTypeId) 
        {
        case 0:
            return console.log("snowwar")
        default:
            return console.log(parser.gameTypeId)
        }
    })

    useEffect(()=>
    {
        if(isVisible) 
        {
            SendMessageComposer(new GetGameListMessageComposer())
        }
        else 
        {
            // dispose or wtv
        }
    },[ isVisible ])

    return {
        isVisible, setIsVisible,
        games,
        accountStatus,
        selectedGame, setSelectedGame,
        gameOffline,
        gameURL, setGameURL
    }
}

export const useGameCenter = () => useBetween(useGameCenterState)
