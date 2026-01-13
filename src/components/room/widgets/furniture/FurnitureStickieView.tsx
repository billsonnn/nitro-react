import { FC, useEffect, useState } from "react"
import { ColorUtils } from "../../../../api"
import { DraggableWindow, DraggableWindowPosition } from "../../../../common"
import { useFurnitureStickieWidget } from "../../../../hooks"

const STICKIE_COLORS = [ "9CCEFF","FF9CFF", "9CFF9C","FFFF33" ]
const STICKIE_COLOR_NAMES = [ "blue", "pink", "green", "yellow" ]
const STICKIE_TYPES = [ "post_it","post_it_shakesp", "post_it_dreams","post_it_xmas", "post_it_vd", "post_it_juninas" ]
const STICKIE_TYPE_NAMES = [ "post_it", "shakesp", "dreams", "christmas", "heart", "juninas" ]

const getStickieColorName = (color: string) =>
{
    let index = STICKIE_COLORS.indexOf(color)

    if(index === -1) index = 0

    return STICKIE_COLOR_NAMES[index]
}

const getStickieTypeName = (type: string) =>
{
    let index = STICKIE_TYPES.indexOf(type)

    if(index === -1) index = 0

    return STICKIE_TYPE_NAMES[index]
}

export const FurnitureStickieView: FC<{}> = props =>
{
    const { objectId = -1, color = "0", text = "", type = "", canModify = false, updateColor = null, updateText = null, trash = null, onClose = null } = useFurnitureStickieWidget()
    const [ isEditing, setIsEditing ] = useState(false)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const target = event.target as HTMLTextAreaElement
        const maxRows = 8
        const maxCharactersPerRow = 27
        const currentLines = target.value.split("\n").length
        const currentLine = target.value.substr(0, target.selectionStart).split("\n").length
        const currentCharacterCount = target.value.split("\n")[currentLine - 1].length
    
        if (currentLines === maxRows && event.key === "Enter") {
            event.preventDefault()
        }
    
        if ((currentLines > maxRows) || (currentLines === maxRows && currentCharacterCount >= maxCharactersPerRow && event.key !== "Backspace")) {
            event.preventDefault()
        }
    }           
    
    useEffect(() => {
        setIsEditing(false)
    }, [ objectId, color, text, type ])
  
    if (objectId === -1) return null
  
    return (
        <DraggableWindow handleSelector=".drag-handler" windowPosition={DraggableWindowPosition.TOP_LEFT}>
            <div className={"flex flex-col bg-[url('/client-assets/images/room-widgets/stickie/spritesheet.png?v=2451779')] w-[185px] h-[178px] px-[7px] illumina-stickie-image stickie-" + (type === "post_it" ? getStickieColorName(color) : getStickieTypeName(type)) }>
                <div className="drag-handler flex h-[19px] items-center justify-between">
                    <div className="flex h-full flex-1 items-center">
                        {canModify && (
                            <div className="flex gap-0.5">
                                <div className="ml-0.5 mr-2 h-2.5 w-[9px] cursor-pointer bg-[url('/client-assets/images/room-widgets/stickie/spritesheet.png?v=2451779')] bg-[-16px_-366px]" onClick={trash} />
                                {type === "post_it" && STICKIE_COLORS.map(color => <div key={color} className="size-2.5" onClick={event => updateColor(color)} style={{ backgroundColor: ColorUtils.makeColorHex(color) }}/>)}
                            </div>
                        )}
                    </div>
                    <div className="size-2.5 cursor-pointer bg-[url('/client-assets/images/room-widgets/stickie/spritesheet.png?v=2451779')] bg-[-2px_-366px]" onClick={onClose} />
                </div>
                <div className="flex h-[140px] flex-col pt-2.5">
                    {!isEditing || !canModify
                        ? (
                            <div
                                className={`!leading-2.5 size-full break-words font-volter text-[9px] !text-black ${canModify && "cursor-text"}`}
                                onClick={event => canModify && setIsEditing(true)}
                                dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br>") }}
                            />
                        ) : (
                            <textarea
                                className="sticky-text context-text !leading-2.5 size-full overflow-hidden bg-transparent font-volter text-[9px] !text-black"
                                spellCheck={ false }
                                defaultValue={ text }
                                tabIndex={ 0 }
                                rows={ 8 }
                                maxLength={ 210 }
                                onKeyDown={ handleKeyDown }
                                onBlur={ event => updateText(event.target.value) }
                                autoFocus
                            />
                        )}
                </div>
            </div>
        </DraggableWindow>
    )
}