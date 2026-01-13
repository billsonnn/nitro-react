import { ILinkEventTracker } from "@nitrots/nitro-renderer"
import { useEffect, useState } from "react"
import { AddEventLinkTracker, RemoveLinkEventTracker, VisitDesktop } from "../../api"
import { useGameCenter } from "../../hooks"
import { GameListView } from "./views/GameListView"
import { GameStageView } from "./views/GameStageView"
import { GameView } from "./views/GameView"

export const GameCenterView = () => 
{
    const{ isVisible, setIsVisible, games, accountStatus } = useGameCenter()
    const [ blackScreen, setBlackScreen ] = useState(false)

    useEffect(() =>
    {

        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const value = url.split("/")
                
                switch(value[1]) 
                {
                case "show":
                    setBlackScreen(true)
                    VisitDesktop()
                    setTimeout(() => {
                        setIsVisible(true)
                    }, 250)
                    return
                case "hide":
                    setIsVisible(false)
                    return
                }
            },
            eventUrlPrefix: "games/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [ ])

    if(!isVisible || !games || !accountStatus) return
    
    return <div className="absolute left-0 top-0 size-full bg-black">
        <div className="flex h-[calc(100%-52px)] flex-col">
            <GameView/>
            <GameListView />
        </div>
        <GameStageView />
    </div>
}
