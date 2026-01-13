import { IRoomCameraWidgetEffect, IRoomCameraWidgetSelectedEffect, RoomCameraWidgetSelectedEffect } from "@nitrots/nitro-renderer"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import ReactSlider from "react-slider"
import { CameraEditorTabs, CameraPicture, CameraPictureThumbnail, GetRoomCameraWidgetManager, LocalizeText } from "../../../../api"
import { Button, LayoutImage, NitroBigCardContentView, NitroBigCardHeaderView, NitroBigCardView, NitroCardTabsItemView, NitroCardTabsView } from "../../../../common"
import { LayoutTimesView } from "../../../../common/layout/LayoutTimesView"
import { CameraWidgetEffectListView } from "./effect-list/CameraWidgetEffectListView"

export interface CameraWidgetEditorViewProps
{
    picture: CameraPicture;
    availableEffects: IRoomCameraWidgetEffect[];
    myLevel: number;
    onClose: () => void;
    onCancel: () => void;
    onCheckout: (pictureUrl: string) => void;
}

const TABS: string[] = [ CameraEditorTabs.COLORMATRIX, CameraEditorTabs.COMPOSITE ]

export const CameraWidgetEditorView: FC<CameraWidgetEditorViewProps> = props =>
{
    const { picture = null, availableEffects = null, myLevel = 1, onClose = null, onCancel = null, onCheckout = null } = props
    const [ currentTab, setCurrentTab ] = useState(TABS[0])
    const [ selectedEffectName, setSelectedEffectName ] = useState<string>(null)
    const [ selectedEffects, setSelectedEffects ] = useState<IRoomCameraWidgetSelectedEffect[]>([])
    const [ effectsThumbnails, setEffectsThumbnails ] = useState<CameraPictureThumbnail[]>([])
    const [ isZoomed, setIsZoomed ] = useState(false)

    const getColorMatrixEffects = useMemo(() =>
    {
        return availableEffects.filter(effect => effect.colorMatrix)
    }, [ availableEffects ])

    const getCompositeEffects = useMemo(() =>
    {
        return availableEffects.filter(effect => effect.texture)
    }, [ availableEffects ])

    const getEffectList = useCallback(() =>
    {
        if(currentTab === CameraEditorTabs.COLORMATRIX)
        {
            return getColorMatrixEffects
        }

        return getCompositeEffects
    }, [ currentTab, getColorMatrixEffects, getCompositeEffects ])

    const getSelectedEffectIndex = useCallback((name: string) =>
    {
        if(!name || !name.length || !selectedEffects || !selectedEffects.length) return -1

        return selectedEffects.findIndex(effect => (effect.effect.name === name))
    }, [ selectedEffects ])

    const getCurrentEffectIndex = useMemo(() =>
    {
        return getSelectedEffectIndex(selectedEffectName)
    }, [ selectedEffectName, getSelectedEffectIndex ])

    const getCurrentEffect = useMemo(() =>
    {
        if(!selectedEffectName) return null

        return (selectedEffects[getCurrentEffectIndex] || null)
    }, [ selectedEffectName, getCurrentEffectIndex, selectedEffects ])

    const setSelectedEffectAlpha = useCallback((alpha: number) =>
    {
        const index = getCurrentEffectIndex

        if(index === -1) return

        setSelectedEffects(prevValue =>
        {
            const clone = [ ...prevValue ]
            const currentEffect = clone[index]

            clone[getCurrentEffectIndex] = new RoomCameraWidgetSelectedEffect(currentEffect.effect, alpha)

            return clone
        })
    }, [ getCurrentEffectIndex, setSelectedEffects ])

    const getCurrentPictureUrl = useMemo(() =>
    {
        return GetRoomCameraWidgetManager().applyEffects(picture.texture, selectedEffects, isZoomed).src
    }, [ picture, selectedEffects, isZoomed ])

    const processAction = useCallback((type: string, effectName: string = null) =>
    {
        switch(type)
        {
        case "close":
            onClose()
            return
        case "cancel":
            onCancel()
            return
        case "checkout":
            onCheckout(getCurrentPictureUrl)
            return
        case "change_tab":
            setCurrentTab(String(effectName))
            return
        case "select_effect": {
            let existingIndex = getSelectedEffectIndex(effectName)

            if(existingIndex >= 0) return
                
            const effect = availableEffects.find(effect => (effect.name === effectName))

            if(!effect) return

            setSelectedEffects(prevValue =>
            {
                return [ ...prevValue, new RoomCameraWidgetSelectedEffect(effect, 1) ]
            })

            setSelectedEffectName(effect.name)
            return
        }
        case "remove_effect": {
            let existingIndex = getSelectedEffectIndex(effectName)

            if(existingIndex === -1) return

            setSelectedEffects(prevValue =>
            {
                const clone = [ ...prevValue ]

                clone.splice(existingIndex, 1)

                return clone
            })

            if(selectedEffectName === effectName) setSelectedEffectName(null)
            return
        }
        case "clear_effects":
            setSelectedEffectName(null)
            setSelectedEffects([])
            return
        case "download": {
            const image = new Image()
                            
            image.src = getCurrentPictureUrl
                            
            const newWindow = window.open("")
            newWindow.document.write(image.outerHTML)
            return
        }
        case "zoom":
            setIsZoomed(!isZoomed)
            return
        }
    }, [ isZoomed, availableEffects, selectedEffectName, getCurrentPictureUrl, getSelectedEffectIndex, onCancel, onCheckout, onClose, setIsZoomed, setSelectedEffects ])

    useEffect(() =>
    {
        const thumbnails: CameraPictureThumbnail[] = []

        for(const effect of availableEffects)
        {
            thumbnails.push(new CameraPictureThumbnail(effect.name, GetRoomCameraWidgetManager().applyEffects(picture.texture, [ new RoomCameraWidgetSelectedEffect(effect, 1) ], false).src))
        }

        setEffectsThumbnails(thumbnails)
    }, [ picture, availableEffects ])

    return (
        <NitroBigCardView uniqueKey="camera" className="illumina-camera w-[680px]">
            <NitroBigCardHeaderView headerText={ LocalizeText("camera.editor.title") } />
            <NitroBigCardContentView>
                <div className="mb-2.5 flex w-full justify-end">
                    <LayoutTimesView onClick={ event => processAction("close") } />
                </div>
                <div className="flex gap-[30px]">
                    <div className="illumina-card-item shrink-0 p-1.5">
                        <div className="relative size-80">
                            <LayoutImage imageUrl={ getCurrentPictureUrl } className="size-full" />
                            { selectedEffectName &&
                                <div className="camera-slider absolute bottom-0 left-0 flex h-[60px] w-full flex-col items-center justify-center bg-[#00000080] ">
                                    <p className="mb-[9px] text-sm font-semibold !leading-3 text-white">{ LocalizeText("camera.effect.name." + selectedEffectName) }</p>
                                    <ReactSlider
                                        className="relative h-2 w-[292px] bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-1px_-539px] py-px"
                                        min={ 0 }
                                        max={ 1 }
                                        step={ 0.01 }
                                        value={ getCurrentEffect.alpha }
                                        onChange={ event => setSelectedEffectAlpha(event) }
                                        trackClassName="h-1.5 track"
                                        renderThumb={ (props, state) => <div { ...props }>
                                            <div className="flex size-5 items-center justify-center bg-[url('/client-assets/images/camera/spritesheet.png?v=2451779')] bg-[-294px_-537px]" />
                                        </div> } />
                                </div> }
                        </div>
                        <div className="mt-1.5 flex gap-2">
                            <Button className="gap-1.5" onClick={ event => processAction("download") }>
                                <i className="h-[15px] w-3.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-410px_-126px]" />
                                <p>{ LocalizeText("postit.save") }</p>
                            </Button>
                            <Button className="gap-1.5" onClick={ event => processAction("zoom") }>
                                <i className="size-4 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-425px_-126px]" />
                                { isZoomed && <p>{ LocalizeText("navigator.zoom.out") }</p> }
                                { !isZoomed && <p>{ LocalizeText("navigator.zoom.in") }</p> }
                            </Button>
                        </div>
                    </div>
                    <div className="illumina-previewer flex w-full flex-col px-[17px] py-[9px]">
                        <NitroCardTabsView className="mb-1.5 w-full !px-0">
                            { TABS.map(tab => (
                                <NitroCardTabsItemView key={ tab } className="!h-8 !w-full" isActive={ currentTab === tab } onClick={ event => processAction("change_tab", tab) }>
                                    { LocalizeText(`camera.editor.filters.${tab}`) }
                                </NitroCardTabsItemView>
                            ))}
                        </NitroCardTabsView>
                        <CameraWidgetEffectListView myLevel={ myLevel } selectedEffects={ selectedEffects } effects={ getEffectList() } thumbnails={ effectsThumbnails } processAction={ processAction } />
                    </div>
                </div>
                <div className="mt-[18px] flex items-center justify-center gap-[193px]">
                    <Button className="!h-[50px] !px-10" onClick={ event => processAction("cancel") }>
                        { LocalizeText("camera.retake.button.text") }
                    </Button>
                    <Button className="!h-[50px] !px-10" onClick={ event => processAction("checkout") }>
                        { LocalizeText("camera.preview.button.text") }
                    </Button>
                </div>
            </NitroBigCardContentView>
        </NitroBigCardView>
    )
}
