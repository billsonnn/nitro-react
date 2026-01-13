import { BotSkillSaveComposer } from "@nitrots/nitro-renderer"
import { FC, useMemo, useState } from "react"
import { BotSkillsEnum, GetRoomObjectBounds, GetRoomSession, LocalizeText, RoomWidgetUpdateRentableBotChatEvent, SendMessageComposer } from "../../../../api"
import { Button, DraggableWindow, DraggableWindowPosition } from "../../../../common"
import { ContextMenuHeaderView } from "../context-menu/ContextMenuHeaderView"

interface AvatarInfoRentableBotChatViewProps
{
    chatEvent: RoomWidgetUpdateRentableBotChatEvent;
    onClose(): void;
}

export const AvatarInfoRentableBotChatView: FC<AvatarInfoRentableBotChatViewProps> = props =>
{
    const { chatEvent = null, onClose = null } = props
    // eslint-disable-next-line no-template-curly-in-string
    const [ newText, setNewText ] = useState<string>(chatEvent.chat === "${bot.skill.chatter.configuration.text.placeholder}" ? "" : chatEvent.chat)
    const [ automaticChat, setAutomaticChat ] = useState<boolean>(chatEvent.automaticChat)
    const [ mixSentences, setMixSentences ] = useState<boolean>(chatEvent.mixSentences)
    const [ chatDelay, setChatDelay ] = useState<number>(chatEvent.chatDelay)

    const getObjectLocation = useMemo(() => GetRoomObjectBounds(GetRoomSession().roomId, chatEvent.objectId, chatEvent.category, 1), [ chatEvent ])

    const formatChatString = (value: string) => value.replace(/;#;/g, " ").replace(/\r\n|\r|\n/g, "\r")

    const save = () =>
    {
        const chatConfiguration = formatChatString(newText) + ";#;" + automaticChat + ";#;" + chatDelay + ";#;" + mixSentences

        SendMessageComposer(new BotSkillSaveComposer(chatEvent.botId, BotSkillsEnum.SETUP_CHAT, chatConfiguration))

        onClose()
    }
    
    return (
        <DraggableWindow windowPosition={ DraggableWindowPosition.NOTHING } handleSelector=".drag-handler" dragStyle={ { top: getObjectLocation.y, left: getObjectLocation.x } }>
            <div className="illumina-card visible absolute z-50 flex min-w-[266px] flex-col px-2 py-3">
                <ContextMenuHeaderView className="drag-handler">
                    { LocalizeText("bot.skill.chatter.configuration.title") }
                </ContextMenuHeaderView>
                <div className="flex flex-col p-1">
                    <div className="flex flex-col">
                        <p className="pb-[5px] text-xs !leading-3">{ LocalizeText("bot.skill.chatter.configuration.chat.text") }</p>
                        <textarea className="border border-[#919191] bg-transparent px-0.5 py-[3px] text-xs dark:border-[#36322C]" spellCheck={ false } value={ newText } rows={ 7 } onChange={ e => setNewText(e.target.value) } />
                    </div>
                    <div className="mt-0.5">
                        <div className="mb-[5px] flex justify-between">
                            <p className="text-xs !leading-3">{ LocalizeText("bot.skill.chatter.configuration.automatic.chat") }</p>
                            <input type="checkbox" className="illumina-input toggle" checked={ automaticChat } onChange={ event => setAutomaticChat(event.target.checked) } />
                        </div>
                        <div className="mb-[5px] flex justify-between">
                            <p className="text-xs !leading-3">{ LocalizeText("bot.skill.chatter.configuration.markov") }</p>
                            <input type="checkbox" className="illumina-input toggle" checked={ mixSentences } onChange={ event => setMixSentences(event.target.checked) } />
                        </div>
                        <div className="flex justify-between">
                            <p className="text-xs !leading-3">{ LocalizeText("bot.skill.chatter.configuration.chat.delay") }</p>
                            <input type="number" className="h-3.5 w-[30px] border border-[#919191] bg-transparent p-px text-[11px] dark:border-[#36322C]" value={ chatDelay } onChange={ event => setChatDelay(event.target.valueAsNumber) }/>
                        </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-end gap-1">
                        <Button variant="primary" onClick={ onClose }>{ LocalizeText("cancel") }</Button>
                        <Button variant="success" onClick={ save }>{ LocalizeText("save") }</Button>
                    </div>
                </div>
            </div>
        </DraggableWindow>
    )
}
