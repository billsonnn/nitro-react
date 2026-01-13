import { UpdateRoomFilterMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { LocalizeText, SendMessageComposer } from "../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useFilterWordsWidget, useNavigator } from "../../../../hooks"

export const RoomFilterWordsWidgetView: FC<{}> = props =>
{
    const [ word, setWord ] = useState<string>("bobba")
    const [ selectedWord, setSelectedWord ] = useState<string>("")
    const [ isSelectingWord, setIsSelectingWord ] = useState<boolean>(false)
    const { wordsFilter = [], isVisible = null, setWordsFilter, onClose = null } = useFilterWordsWidget()
    const { navigatorData = null } = useNavigator()

    const processAction = (isAddingWord: boolean) =>
    {
        if ((isSelectingWord) ? (!selectedWord) : (!word)) return

        SendMessageComposer(new UpdateRoomFilterMessageComposer(navigatorData.enteredGuestRoom.roomId, isAddingWord, (isSelectingWord ? selectedWord : word)))
        setSelectedWord("")
        setWord("bobba")
        setIsSelectingWord(false)

        if (isAddingWord && wordsFilter.includes((isSelectingWord ? selectedWord : word))) return

        setWordsFilter(prevValue =>
        {
            const newWords = [ ...prevValue ]

            isAddingWord ? newWords.push((isSelectingWord ? selectedWord : word)) : newWords.splice(newWords.indexOf((isSelectingWord ? selectedWord : word)), 1)

            return newWords
        })
    }

    const onTyping = (word: string) =>
    {
        setWord(word)
        setIsSelectingWord(false)
    }

    const onSelectedWord = (word: string) =>
    {
        setSelectedWord(word)
        setIsSelectingWord(true)
    }

    if (!isVisible) return null

    return (
        <NitroCardView uniqueKey="filter-words" className="illumina-filter-words w-[250px]">
            <NitroCardHeaderView headerText={ LocalizeText("navigator.roomsettings.roomfilter") } onCloseClick={ () => onClose() } />
            <NitroCardContentView>
                <div className="mb-3.5 flex gap-1">
                    <input type="text" className="illumina-input h-[31px] flex-1 p-2" maxLength={ 255 } value={ word } onChange={ event => onTyping(event.target.value) } />
                    <Button className="h-[30px]" onClick={ () => processAction(true) }>{ LocalizeText("navigator.roomsettings.roomfilter.addword") }</Button>
                </div>
                <div className="illumina-input relative w-full">
                    <div className="illumina-scrollbar mx-1.5 my-1 h-[100px] max-h-[100px]">
                        { wordsFilter && (wordsFilter.length > 0) && wordsFilter.map((word, index) => (
                            <div key={ index } className={`cursor-pointer overflow-hidden p-1 odd:bg-[#e2e2e2] dark:odd:bg-[#27251F] ${selectedWord === word ? "!bg-[#CCCCCC] dark:!bg-[#181512]" : ""}`} onClick={ event => onSelectedWord(word) }>
                                <p className="text-sm">{ word }</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-2 flex items-center justify-end">
                    <Button onClick={ () => processAction(false) } disabled={ wordsFilter.length === 0 || !isSelectingWord }>{ LocalizeText("navigator.roomsettings.roomfilter.removeword") }</Button>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
