import { Game2GetAccountGameStatusMessageComposer, GetGameStatusMessageComposer } from "@nitrots/nitro-renderer"
import { useEffect, useRef, useState } from "react"
import { GetSessionDataManager, LocalizeText, SendMessageComposer } from "../../../api"
import { Button, NitroBigCardContentView, NitroBigCardHeaderView, NitroBigCardView } from "../../../common"
import { LayoutTimesView } from "../../../common/layout/LayoutTimesView"
import { useGameCenter } from "../../../hooks"

export const GameView = () => 
{
    const { selectedGame, accountStatus } = useGameCenter()
    const [ isGameLoading, setIsGameLoading ] = useState(false)
    const [ iframeSrc, setIframeSrc ] = useState(null)
    const basejumpRef = useRef(null)

    const getBgColour = (): string => 
    {
        return selectedGame.bgColor
    }

    const getBgImage = (): string => 
    {
        return `url(${ selectedGame.assetUrl }game_theme_bg.png)`
    }

    const getBgLeftImage = (): string => 
    {
        return `url(${ selectedGame.assetUrl }game_theme_left.png)`
    }

    const getBgRightImage = (): string => 
    {
        return `url(${ selectedGame.assetUrl }game_theme_right.png)`
    }

    const onPlay = async (gameNameId: string) => 
    {
        setIsGameLoading(true)

        if (gameNameId === "basejump") {            
            const fetchData = async () => {
                const fastFoodData = {
                    "api-key": selectedGame.apiKey,
                    "user-id": GetSessionDataManager().userId.toString(),
                    "user-name": GetSessionDataManager().userName,
                    "user-avatar": GetSessionDataManager().figure,
                    "theme": selectedGame.theme
                }
              
                const formData = new URLSearchParams(fastFoodData).toString()
              
                try {
                    const response = await fetch("https://api.thefastfoodgame.com/api", {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: formData
                    })
              
                    if (!response.ok) {
                        throw new Error("Network response was not ok")
                    }

                    const serverOutput = await response.json()
                  
                    setIframeSrc(serverOutput.url)
                } catch (error) {
                    alert(`There was a problem with the fetch operation: ${error}`)
                } finally {
                    setIsGameLoading(false)
                }
            }
              
            fetchData()              
        }
        //SendMessageComposer(new JoinQueueMessageComposer(selectedGame.gameId))
    }

    useEffect(()=>
    {
        if(selectedGame) 
        {
            SendMessageComposer(new GetGameStatusMessageComposer(selectedGame.gameId))
            SendMessageComposer(new Game2GetAccountGameStatusMessageComposer(selectedGame.gameId))
        }
    },[ selectedGame ])

    return <>
        <div className="relative flex size-full justify-center bg-left-bottom bg-repeat-x pt-[63px]" style={ { backgroundColor: getBgColour(), backgroundImage: getBgImage() } }>
            <div className="z-10 w-full max-w-[960px]">
                <div className="flex w-[540px] flex-col items-center">
                    <div className="flex flex-col items-center">
                        <p className="pb-2 text-center text-xs font-semibold !leading-3 [text-shadow:_0_1px_0_#fff]" style={{ textShadow: `0 1px 0 ${getBgColour()}` }}>{ LocalizeText(`gamecenter.${ selectedGame.gameNameId }.description_title`) }</p>
                        <img src={ selectedGame.assetUrl + "game_logo.png" } />
                        { (accountStatus.hasUnlimitedGames || accountStatus.freeGamesLeft > 0) && <>
                            <Button className="relative !h-10 !font-volter_bold !text-[9px] !font-normal" onClick={ event => onPlay(selectedGame.gameNameId) }>
                                { LocalizeText("gamecenter.play_now") }
                                {/* { !accountStatus.hasUnlimitedGames && 
                                    <LayoutItemCountView count={ accountStatus.freeGamesLeft }/> } */}
                            </Button>
                        </> }
                        <p className="w-[350px] pt-2.5 text-center text-xs !leading-3 [text-shadow:_0_1px_0_#fff]" style={{ textShadow: `0 1px 0 ${getBgColour()}` }}>{ LocalizeText(`gamecenter.${ selectedGame.gameNameId }.description_content`) }</p>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 right-0 hidden size-full bg-right-bottom bg-no-repeat xl:block" style={ { backgroundImage: getBgRightImage() } } />
            <div className="absolute bottom-0 left-0 size-full bg-left-bottom bg-no-repeat" style={ { backgroundImage: getBgLeftImage() } } />
        </div>
        { isGameLoading && <>
            <NitroBigCardView>
                <NitroBigCardHeaderView headerText={LocalizeText("gamecenter.waiting.game.title")} />
                <NitroBigCardContentView>
                    <div className="mb-1 flex w-full justify-end">
                        <LayoutTimesView onClick={ event => setIsGameLoading(false) } />
                    </div>
                    <img src={ selectedGame.assetUrl + "game_logo.png" } className="mb-8" />
                    <Button variant="underline" onClick={ event => setIsGameLoading(false) }>{ LocalizeText("generic.cancel") }</Button>
                </NitroBigCardContentView>
            </NitroBigCardView>
        </> }
        { iframeSrc &&
            <div className="absolute left-0 top-0 size-full">
                <iframe ref={ basejumpRef } src={ iframeSrc } className="absolute left-0 top-0 z-[99999] size-full" />
                <div className="position-game-exit absolute left-10 top-0 z-[999999]">
                    <div className="flex justify-center gap-8">
                        <span className="h-4 w-1 border-x border-black bg-[#6E6E6E]" />
                        <span className="h-4 w-1 border-x border-black bg-[#6E6E6E]" />
                    </div>
                    <button className="border border-black bg-[#E02D11] px-2 py-2.5" onClick={ () => setIframeSrc(null) }>
                        <p className="text-3xl font-extrabold uppercase text-white">{ LocalizeText("quiz.SafetyQuiz1.exit.button") }</p>
                    </button>
                </div>
            </div> }
    </>
}
