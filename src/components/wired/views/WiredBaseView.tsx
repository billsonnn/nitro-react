import { FC, PropsWithChildren, useEffect, useState } from "react"
import { GetSessionDataManager, LocalizeText, WiredFurniType, WiredSelectionVisualizer } from "../../../api"
import { Button, DraggableWindow } from "../../../common"
import { useWired } from "../../../hooks"
import { WiredFurniSelectorView } from "./WiredFurniSelectorView"

export interface WiredBaseViewProps
{
    wiredType: string;
    requiresFurni: number;
    hasSpecialInput: boolean;
    save: () => void;
    validate?: () => boolean;
}

export const WiredBaseView: FC<PropsWithChildren<WiredBaseViewProps>> = props =>
{
    const { wiredType = "", requiresFurni = WiredFurniType.STUFF_SELECTION_OPTION_NONE, save = null, validate = null, children = null, hasSpecialInput = false } = props
    const [ wiredName, setWiredName ] = useState<string>(null)
    const [ wiredDescription, setWiredDescription ] = useState<string>(null)
    const [ needsSave, setNeedsSave ] = useState<boolean>(false)
    const { trigger = null, setTrigger = null, setIntParams = null, setStringParam = null, setFurniIds = null, setAllowsFurni = null, saveWired = null } = useWired()

    const onClose = () => setTrigger(null)
    
    const onSave = () =>
    {
        if(validate && !validate()) return

        if(save) save()

        setNeedsSave(true)
    }

    useEffect(() =>
    {
        if(!needsSave) return

        saveWired()

        setNeedsSave(false)
    }, [ needsSave, saveWired ])

    useEffect(() =>
    {
        if(!trigger) return

        const spriteId = (trigger.spriteId || -1)
        const furniData = GetSessionDataManager().getFloorItemData(spriteId)

        if(!furniData)
        {
            setWiredName(("NAME: " + spriteId))
            setWiredDescription(("NAME: " + spriteId))
        }
        else
        {
            setWiredName(furniData.name)
            setWiredDescription(furniData.description)
        }

        if(hasSpecialInput)
        {
            setIntParams(trigger.intData)
            setStringParam(trigger.stringData)
        }
        
        if(requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE)
        {
            setFurniIds(prevValue =>
            {
                if(prevValue && prevValue.length) WiredSelectionVisualizer.clearSelectionShaderFromFurni(prevValue)

                if(trigger.selectedItems && trigger.selectedItems.length)
                {
                    WiredSelectionVisualizer.applySelectionShaderToFurni(trigger.selectedItems)

                    return trigger.selectedItems
                }

                return []
            })
        }

        setAllowsFurni(requiresFurni)
    }, [ trigger, hasSpecialInput, requiresFurni, setIntParams, setStringParam, setFurniIds, setAllowsFurni ])

    const WIRED_TYPE = {
        trigger: "bg-[-91px_-220px]",
        action: "bg-[-63px_-220px]",
        condition: "bg-[-77px_-220px]"
    }

    return (
        <DraggableWindow handleSelector=".illumina-wired-header">
            <div className="illumina-wired w-60 p-1.5 pb-2">
                <div className="illumina-wired-header relative flex h-[15px] w-full items-center justify-center bg-[url('/client-assets/images/wireds/header-bg.png?v=2451779')] bg-repeat-x">
                    <p className="font-volter_bold">{ LocalizeText("wiredfurni.title") }</p>
                    <button className="absolute right-px top-0.5" onClick={ onClose }>
                        <i className="block size-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-63px_-193px] hover:bg-[-75px_-206px] active:bg-[-77px_-193px]" />
                    </button>
                </div>
                <div className="mt-[9px] px-[5px]">
                    <div className="mb-[11px]">
                        <div className="flex gap-[9px]">
                            <i className={ `block h-3.5 w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] ${ WIRED_TYPE[wiredType] }` } />
                            <p className="font-volter_bold">{ wiredName }</p>
                        </div>
                    </div>
                    { !!children && <div className="my-[7px] h-px w-full bg-[#232323]" /> }
                    { children }
                    { (requiresFurni > WiredFurniType.STUFF_SELECTION_OPTION_NONE) &&
                        <>
                            <div className="my-[7px] h-px w-full bg-[#232323]" /> 
                            <div className="mb-[25px] px-[5px]">
                                <WiredFurniSelectorView />
                            </div>
                        </> }
                    <div className="my-[5px] h-px w-full bg-[#232323]" /> 
                    <div className="flex items-center gap-3 px-[5px]">
                        <Button variant="wired" onClick={ onSave }>{ LocalizeText("wiredfurni.ready") }</Button>
                        <Button variant="wired" onClick={ onClose }>{ LocalizeText("cancel") }</Button>
                    </div>
                </div>
            </div>
        </DraggableWindow>
    )
}
