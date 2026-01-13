import { FC, MouseEvent, useEffect, useState } from "react"

interface ChatInputStyleSelectorViewProps
{
    chatStyleId: number;
    chatStyleIds: number[];
    selectChatStyleId: (styleId: number) => void;
}

export const ChatInputStyleSelectorView: FC<ChatInputStyleSelectorViewProps> = props =>
{
    const { chatStyleId = 0, chatStyleIds = null, selectChatStyleId = null } = props
    const [ target, setTarget ] = useState<(EventTarget & HTMLElement)>(null)
    const [ selectorVisible, setSelectorVisible ] = useState(false)

    const selectStyle = (styleId: number) =>
    {
        selectChatStyleId(styleId)
        setSelectorVisible(false)
    }

    const toggleSelector = (event: MouseEvent<HTMLElement>) =>
    {
        let visible = false

        setSelectorVisible(prevValue =>
        {
            visible = !prevValue

            return visible
        })

        if(visible) setTarget((event.target as (EventTarget & HTMLElement)))
    }

    useEffect(() =>
    {
        if(selectorVisible) return

        setTarget(null)
    }, [ selectorVisible ])

    return (
        <>
            <i className="absolute right-2 block h-[19px] w-[17px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-353px_0px]" onClick={ toggleSelector } />
            {selectorVisible &&
                <div className="illumina-popover pixelated absolute bottom-11 right-0 size-[200px]">
                    <div className="flex h-full flex-col gap-2 overflow-hidden bg-transparent p-2.5">
                        <div className="illumina-scrollbar grid !grid-cols-3 gap-1.5 overflow-auto">
                            { chatStyleIds && (chatStyleIds.length > 0) && chatStyleIds.map((styleId) => {
                                return (
                                    <div key={ styleId } className="flex h-[30px] cursor-pointer items-center justify-center" onClick={ event => selectStyle(styleId) }>
                                        <div key={ styleId } className="bubble-container !relative !w-[50px]">
                                            <div className={ `chat-bubble relative z-[1] min-h-[26px] max-w-full [word-break:break-word] ${ "bubble-" + styleId }` }>&nbsp;</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
