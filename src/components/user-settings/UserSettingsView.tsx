import { ILinkEventTracker, NitroSettingsEvent, UserSettingsCameraFollowComposer, UserSettingsEvent, UserSettingsOldChatComposer, UserSettingsRoomInvitesComposer, UserSettingsSoundComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { AddEventLinkTracker, DispatchMainEvent, DispatchUiEvent, GetConfiguration, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from "../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../common"
import { useMessageEvent } from "../../hooks"

export const UserSettingsView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const [ userSettings, setUserSettings ] = useState<NitroSettingsEvent>(null)
    const [ isDarkMode, setIsDarkMode ] = useState(false)

    const defaultTheme: boolean = GetConfiguration<string>("illumina.main.theme") === "dark"

    const handleDarkModeChange = (event) => {
        const isChecked = event.target.checked
        setIsDarkMode(isChecked)
        localStorage.setItem("isDarkMode", isChecked)
        location.reload()
    }

    const processAction = (type: string, value?: boolean | number | string) =>
    {
        let doUpdate = true

        const clone = userSettings.clone()

        switch(type)
        {
        case "close_view":
            setIsVisible(false)
            doUpdate = false
            return
        case "oldchat":
            clone.oldChat = value as boolean
            SendMessageComposer(new UserSettingsOldChatComposer(clone.oldChat))
            break
        case "room_invites":
            clone.roomInvites = value as boolean
            SendMessageComposer(new UserSettingsRoomInvitesComposer(clone.roomInvites))
            break
        case "camera_follow":
            clone.cameraFollow = value as boolean
            SendMessageComposer(new UserSettingsCameraFollowComposer(clone.cameraFollow))
            break
        case "system_volume":
            clone.volumeSystem = value as number
            clone.volumeSystem = Math.max(0, clone.volumeSystem)
            clone.volumeSystem = Math.min(100, clone.volumeSystem)
            break
        case "furni_volume":
            clone.volumeFurni = value as number
            clone.volumeFurni = Math.max(0, clone.volumeFurni)
            clone.volumeFurni = Math.min(100, clone.volumeFurni)
            break
        case "trax_volume":
            clone.volumeTrax = value as number
            clone.volumeTrax = Math.max(0, clone.volumeTrax)
            clone.volumeTrax = Math.min(100, clone.volumeTrax)
            break
        }

        if(doUpdate) setUserSettings(clone)
        
        DispatchMainEvent(clone)
    }

    const saveRangeSlider = (type: string) =>
    {
        switch(type)
        {
        case "volume":
            SendMessageComposer(new UserSettingsSoundComposer(Math.round(userSettings.volumeSystem), Math.round(userSettings.volumeFurni), Math.round(userSettings.volumeTrax)))
            break
        }
    }

    useMessageEvent<UserSettingsEvent>(UserSettingsEvent, event =>
    {
        const parser = event.getParser()
        const settingsEvent = new NitroSettingsEvent()

        settingsEvent.volumeSystem = parser.volumeSystem
        settingsEvent.volumeFurni = parser.volumeFurni
        settingsEvent.volumeTrax = parser.volumeTrax
        settingsEvent.oldChat = parser.oldChat
        settingsEvent.roomInvites = parser.roomInvites
        settingsEvent.cameraFollow = parser.cameraFollow
        settingsEvent.flags = parser.flags
        settingsEvent.chatType = parser.chatType

        setUserSettings(settingsEvent)
        DispatchMainEvent(settingsEvent)
    })

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split("/")

                if(parts.length < 2) return
        
                switch(parts[1])
                {
                case "show":
                    setIsVisible(true)
                    return
                case "hide":
                    setIsVisible(false)
                    return
                case "toggle":
                    setIsVisible(prevValue => !prevValue)
                    return
                }
            },
            eventUrlPrefix: "user-settings/"
        }

        AddEventLinkTracker(linkTracker)

        return () => RemoveLinkEventTracker(linkTracker)
    }, [])

    useEffect(() => {
        const storedIsDarkMode = localStorage.getItem("isDarkMode")
        setIsDarkMode(storedIsDarkMode === "true")
    }, [])

    useEffect(() =>
    {
        if(!userSettings) return

        DispatchUiEvent(userSettings)
    }, [ userSettings ])

    useEffect(() => {
        const savedTheme = localStorage.getItem("isDarkMode")
        if(savedTheme === null) {
            setIsDarkMode(defaultTheme)
        } else if(savedTheme === "true") {
            setIsDarkMode(true)
        } else {
            setIsDarkMode(false)
        }
    }, [ isDarkMode, defaultTheme ])

    if(!isVisible || !userSettings) return null

    return (
        <NitroCardView uniqueKey="user-settings" className="illumina-user-settings max-w-80">
            <NitroCardHeaderView headerText={ LocalizeText("widget.memenu.settings") } onCloseClick={ event => processAction("close_view") } />
            <NitroCardContentView>
                <div className="illumina-card mb-3 flex flex-col gap-[7px] p-3">
                    <div className="flex items-center gap-1.5">
                        <input id="oldChat" className="illumina-input" type="checkbox" checked={ userSettings.oldChat } onChange={ event => processAction("oldchat", event.target.checked) } />
                        <label htmlFor="oldChat" className="cursor-pointer text-sm">{ LocalizeText("memenu.settings.chat.prefer.old.chat") }</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <input id="roomInvites" className="illumina-input" type="checkbox" checked={ userSettings.roomInvites } onChange={ event => processAction("room_invites", event.target.checked) } />
                        <label htmlFor="roomInvites" className="cursor-pointer text-sm">{ LocalizeText("memenu.settings.other.ignore.room.invites") }</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <input id="cameraFollow" className="illumina-input" type="checkbox" checked={ userSettings.cameraFollow } onChange={ event => processAction("camera_follow", event.target.checked) } />
                        <label htmlFor="cameraFollow" className="cursor-pointer text-sm">{ LocalizeText("memenu.settings.other.disable.room.camera.follow") }</label>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <input id="darkMode" className="illumina-input" type="checkbox" checked={ isDarkMode } onChange={ handleDarkModeChange } />
                        <label htmlFor="darkMode" className="cursor-pointer text-sm">{ LocalizeText("memenu.settings.other.dark.mode") }</label>
                    </div>
                </div>
                <div className="illumina-card mb-[18px] p-3">
                    <p className="mb-2 text-sm font-semibold  !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("widget.memenu.settings.volume") }</p>
                    <div className="flex items-center">
                        <p className="w-[58px] text-[13px]">{ LocalizeText("widget.memenu.settings.volume.ui") }</p>
                        <div className="flex items-center gap-[9px]">
                            <i className={`h-[22px] w-[29px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${(userSettings.volumeSystem === 0) ? "bg-[-123px_-119px]" : "bg-[-183px_-120px]"}`} />
                            <input type="range" className="illumina-input" min="0" max="100" step="1" id="volumeSystem" value={ userSettings.volumeSystem } onChange={ event => processAction("system_volume", event.target.value) } onMouseUp={ () => saveRangeSlider("volume") }/>
                            <i className={`h-[22px] w-[29px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${(userSettings.volumeSystem === 0) ? "bg-[-213px_-120px]" : "bg-[-153px_-118px]"}`} />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <p className="w-[58px] text-[13px]">{ LocalizeText("widget.memenu.settings.volume.furni") }</p>
                        <div className="flex items-center gap-[9px]">
                            <i className={`h-[22px] w-[29px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${(userSettings.volumeFurni === 0) ? "bg-[-123px_-119px]" : "bg-[-183px_-120px]"}`} />
                            <input type="range" className="illumina-input" min="0" max="100" step="1" id="volumeFurni" value={ userSettings.volumeFurni } onChange={ event => processAction("furni_volume", event.target.value) } onMouseUp={ () => saveRangeSlider("volume") }/>
                            <i className={`h-[22px] w-[29px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${(userSettings.volumeFurni === 0) ? "bg-[-213px_-120px]" : "bg-[-153px_-118px]"}`} />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <p className="w-[58px] text-[13px]">{ LocalizeText("widget.memenu.settings.volume.trax") }</p>
                        <div className="flex items-center gap-[9px]">
                            <i className={`h-[22px] w-[29px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${(userSettings.volumeTrax === 0) ? "bg-[-123px_-119px]" : "bg-[-183px_-120px]"}`} />
                            <input type="range" className="illumina-input" min="0" max="100" step="1" id="volumeTrax" value={ userSettings.volumeTrax } onChange={ event => processAction("trax_volume", event.target.value) } onMouseUp={ () => saveRangeSlider("volume") }/>
                            <i className={`h-[22px] w-[29px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${(userSettings.volumeTrax === 0) ? "bg-[-213px_-120px]" : "bg-[-153px_-118px]"}`} />
                        </div>
                    </div>
                </div>
                <Button onClick={ () => window.location.href = "/logout" }>{ LocalizeText("panic.button.caption") }</Button>
            </NitroCardContentView>
        </NitroCardView>
    )
}
