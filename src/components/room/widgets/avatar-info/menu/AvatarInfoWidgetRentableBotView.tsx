import { BotCommandConfigurationEvent, BotRemoveComposer, BotSkillSaveComposer, RequestBotCommandConfigurationComposer, RoomObjectCategory, RoomObjectType } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { AvatarInfoRentableBot, BotSkillsEnum, DispatchUiEvent, GetConfiguration, GetNitroInstance, LocalizeText, RoomWidgetUpdateRentableBotChatEvent, SendMessageComposer } from "../../../../../api"
import { Button } from "../../../../../common"
import { useMessageEvent } from "../../../../../hooks"
import { ContextMenuHeaderView } from "../../context-menu/ContextMenuHeaderView"
import { ContextMenuListItemView } from "../../context-menu/ContextMenuListItemView"
import { ContextMenuView } from "../../context-menu/ContextMenuView"

interface AvatarInfoWidgetRentableBotViewProps
{
    avatarInfo: AvatarInfoRentableBot;
    onClose: () => void;
}

const MODE_NORMAL = 0
const MODE_CHANGE_NAME = 1
const MODE_CHANGE_MOTTO = 2

export const AvatarInfoWidgetRentableBotView: FC<AvatarInfoWidgetRentableBotViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props
    const [ mode, setMode ] = useState(MODE_NORMAL)
    const [ newName, setNewName ] = useState("")
    const [ newMotto, setNewMotto ] = useState("")

    useMessageEvent<BotCommandConfigurationEvent>(BotCommandConfigurationEvent, event =>
    {
        const parser = event.getParser()

        if(parser.botId !== avatarInfo.webID) return

        switch(parser.commandId)
        {
        case BotSkillsEnum.CHANGE_BOT_NAME:
            setNewName(parser.data)
            setMode(MODE_CHANGE_NAME)
            return
        case BotSkillsEnum.CHANGE_BOT_MOTTO:
            setNewMotto(parser.data)
            setMode(MODE_CHANGE_MOTTO)
            return
        case BotSkillsEnum.SETUP_CHAT: {
            const data = parser.data
            const pieces = data.split(((data.indexOf(";#;") === -1) ? ";" : ";#;"))

            if((pieces.length === 3) || (pieces.length === 4))
            {
                DispatchUiEvent(new RoomWidgetUpdateRentableBotChatEvent(
                    avatarInfo.roomIndex,
                    RoomObjectCategory.UNIT,
                    avatarInfo.webID,
                    pieces[0],
                    ((pieces[1].toLowerCase() === "true") || (pieces[1] === "1")),
                    parseInt(pieces[2]),
                    ((pieces[3]) ? ((pieces[3].toLowerCase() === "true") || (pieces[3] === "1")) : false)))

                onClose()
            }

            return
        }
        }
    })

    const requestBotCommandConfiguration = (skillType: number) => SendMessageComposer(new RequestBotCommandConfigurationComposer(avatarInfo.webID, skillType))

    const processAction = (name: string) =>
    {
        let hideMenu = true

        if(name)
        {
            switch(name)
            {
            case "donate_to_all":
                requestBotCommandConfiguration(BotSkillsEnum.DONATE_TO_ALL)
                SendMessageComposer(new BotSkillSaveComposer(avatarInfo.webID, BotSkillsEnum.DONATE_TO_ALL, ""))
                break
            case "donate_to_user":
                requestBotCommandConfiguration(BotSkillsEnum.DONATE_TO_USER)
                SendMessageComposer(new BotSkillSaveComposer(avatarInfo.webID, BotSkillsEnum.DONATE_TO_USER, ""))
                break
            case "change_bot_name":
                requestBotCommandConfiguration(BotSkillsEnum.CHANGE_BOT_NAME)
                hideMenu = false
                break
            case "save_bot_name":
                SendMessageComposer(new BotSkillSaveComposer(avatarInfo.webID, BotSkillsEnum.CHANGE_BOT_NAME, newName))
                break
            case "change_bot_motto":
                requestBotCommandConfiguration(BotSkillsEnum.CHANGE_BOT_MOTTO)
                hideMenu = false
                break
            case "save_bot_motto":
                SendMessageComposer(new BotSkillSaveComposer(avatarInfo.webID, BotSkillsEnum.CHANGE_BOT_MOTTO, newMotto))
                break
            case "dress_up":
                SendMessageComposer(new BotSkillSaveComposer(avatarInfo.webID, BotSkillsEnum.DRESS_UP, ""))
                break
            case "random_walk":
                SendMessageComposer(new BotSkillSaveComposer(avatarInfo.webID, BotSkillsEnum.RANDOM_WALK, ""))
                break
            case "setup_chat":
                requestBotCommandConfiguration(BotSkillsEnum.SETUP_CHAT)
                hideMenu = false
                break
            case "dance":
                SendMessageComposer(new BotSkillSaveComposer(avatarInfo.webID, BotSkillsEnum.DANCE, ""))
                break
            case "nux_take_tour":
                GetNitroInstance().createLinkEvent("help/tour")
                SendMessageComposer(new BotSkillSaveComposer(avatarInfo.webID, BotSkillsEnum.NUX_TAKE_TOUR, ""))
                break
            case "pick":
                SendMessageComposer(new BotRemoveComposer(avatarInfo.webID))
                break
            default:
                break
            }
        }

        if(hideMenu) onClose()
    }

    useEffect(() =>
    {
        setMode(MODE_NORMAL)
    }, [ avatarInfo ])

    const canControl = (avatarInfo.amIOwner || avatarInfo.amIAnyRoomController)

    return (
        <ContextMenuView objectId={ avatarInfo.roomIndex } category={ RoomObjectCategory.UNIT } userType={ RoomObjectType.RENTABLE_BOT } onClose={ onClose } collapsable={ true }>
            <ContextMenuHeaderView>
                { avatarInfo.name }
            </ContextMenuHeaderView>
            { (mode === MODE_NORMAL) && canControl &&
                <>
                    { (avatarInfo.botSkills.indexOf(BotSkillsEnum.DONATE_TO_ALL) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("donate_to_all") }>
                            { LocalizeText("avatar.widget.donate_to_all") }
                        </ContextMenuListItemView> }
                    { (avatarInfo.botSkills.indexOf(BotSkillsEnum.DONATE_TO_USER) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("donate_to_user") }>
                            { LocalizeText("avatar.widget.donate_to_user") }
                        </ContextMenuListItemView> }
                    { (avatarInfo.botSkills.indexOf(BotSkillsEnum.CHANGE_BOT_NAME) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("change_bot_name") }>
                            { LocalizeText("avatar.widget.change_bot_name") }
                        </ContextMenuListItemView> }
                    { (avatarInfo.botSkills.indexOf(BotSkillsEnum.CHANGE_BOT_MOTTO) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("change_bot_motto") }>
                            { LocalizeText("avatar.widget.change_bot_motto") }
                        </ContextMenuListItemView> }
                    { (avatarInfo.botSkills.indexOf(BotSkillsEnum.DRESS_UP) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("dress_up") }>
                            { LocalizeText("avatar.widget.dress_up") }
                        </ContextMenuListItemView> }
                    { (avatarInfo.botSkills.indexOf(BotSkillsEnum.RANDOM_WALK) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("random_walk") }>
                            { LocalizeText("avatar.widget.random_walk") }
                        </ContextMenuListItemView> }
                    { (avatarInfo.botSkills.indexOf(BotSkillsEnum.SETUP_CHAT) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("setup_chat") }>
                            { LocalizeText("avatar.widget.setup_chat") }
                        </ContextMenuListItemView> }
                    { (avatarInfo.botSkills.indexOf(BotSkillsEnum.DANCE) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction("dance") }>
                            { LocalizeText("avatar.widget.dance") }
                        </ContextMenuListItemView> }
                    { (avatarInfo.botSkills.indexOf(BotSkillsEnum.NO_PICK_UP) === -1) &&
                        <ContextMenuListItemView onClick={ event => processAction("pick") }>
                            { LocalizeText("avatar.widget.pick_up") }
                        </ContextMenuListItemView> }
                </> }
            { (mode === MODE_CHANGE_NAME) &&
                <div className="flex w-[180px] flex-col">
                    <p className="pb-[5px] text-xs !leading-3">{ LocalizeText("bot.skill.name.configuration.new.name") }</p>
                    <input type="text" className="border border-[#919191] bg-transparent px-0.5 py-[3px] text-xs dark:border-[#36322C]" value={ newName } maxLength={ GetConfiguration<number>("bot.name.max.length", 15) } onChange={ event => setNewName(event.target.value) } />
                    <div className="mt-[9px] flex items-center justify-end gap-1">
                        <Button variant="primary" onClick={ event => processAction(null) }>{ LocalizeText("cancel") }</Button>
                        <Button variant="success" onClick={ event => processAction("save_bot_name") }>{ LocalizeText("save") }</Button>
                    </div>
                </div> }
            { (mode === MODE_CHANGE_MOTTO) &&
                <div className="flex w-[180px] flex-col">
                    <p className="pb-[5px] text-xs !leading-3">{ LocalizeText("bot.skill.name.configuration.new.motto") }</p>
                    <input type="text" className="border border-[#919191] bg-transparent px-0.5 py-[3px] text-xs dark:border-[#36322C]" value={ newMotto } maxLength={ GetConfiguration<number>("motto.max.length", 38) } onChange={ event => setNewMotto(event.target.value) } />
                    <div className="mt-[9px] flex items-center justify-end gap-1">
                        <Button variant="primary" onClick={ event => processAction(null) }>{ LocalizeText("cancel") }</Button>
                        <Button variant="success" onClick={ event => processAction("save_bot_motto") }>{ LocalizeText("save") }</Button>
                    </div>
                </div> }
        </ContextMenuView>
    )
}
