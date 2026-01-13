import { CameraPublishStatusMessageEvent, CameraPurchaseOKMessageEvent, CameraStorageUrlMessageEvent, PublishPhotoMessageComposer, PurchasePhotoMessageComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useState } from "react"
import { CreateLinkEvent, GetConfiguration, GetRoomEngine, LocalizeText, SendMessageComposer } from "../../../api"
import { Button, LayoutCurrencyIcon, LayoutImage, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../common"
import { useMessageEvent } from "../../../hooks"

export interface CameraWidgetCheckoutViewProps
{
    base64Url: string;
    onCloseClick: () => void;
    onCancelClick: () => void;
    price: { credits: number, duckets: number, publishDucketPrice: number };
}

export const CameraWidgetCheckoutView: FC<CameraWidgetCheckoutViewProps> = props =>
{
    const { base64Url = null, onCloseClick = null, onCancelClick = null, price = null } = props
    const [ pictureUrl, setPictureUrl ] = useState<string>(null)
    const [ publishUrl, setPublishUrl ] = useState<string>(null)
    const [ picturesBought, setPicturesBought ] = useState(0)
    const [ wasPicturePublished, setWasPicturePublished ] = useState(false)
    const [ isWaiting, setIsWaiting ] = useState(false)
    const [ publishCooldown, setPublishCooldown ] = useState(0)

    const publishDisabled = useMemo(() => GetConfiguration<boolean>("camera.publish.disabled", false), [])

    useMessageEvent<CameraPurchaseOKMessageEvent>(CameraPurchaseOKMessageEvent, event =>
    {
        setPicturesBought(value => (value + 1))
        setIsWaiting(false)
    })

    useMessageEvent<CameraPublishStatusMessageEvent>(CameraPublishStatusMessageEvent, event =>
    {
        const parser = event.getParser()

        setPublishUrl(parser.extraDataId)
        setPublishCooldown(parser.secondsToWait)
        setWasPicturePublished(parser.ok)
        setIsWaiting(false)
    })

    useMessageEvent<CameraStorageUrlMessageEvent>(CameraStorageUrlMessageEvent, event =>
    {
        const parser = event.getParser()

        setPictureUrl(GetConfiguration<string>("camera.url") + "/" + parser.url)
    })

    const processAction = (type: string, value: string | number = null) =>
    {
        switch(type)
        {
        case "close":
            onCloseClick()
            return
        case "buy":
            if(isWaiting) return

            setIsWaiting(true)
            SendMessageComposer(new PurchasePhotoMessageComposer(""))
            return
        case "publish":
            if(isWaiting) return

            setIsWaiting(true)
            SendMessageComposer(new PublishPhotoMessageComposer())
            return
        case "cancel":
            onCancelClick()
            return
        }
    }

    useEffect(() =>
    {
        if(!base64Url) return

        GetRoomEngine().saveBase64AsScreenshot(base64Url)
    }, [ base64Url ])

    if(!price) return null

    return (
        <NitroCardView className="illumina-camera-checkout w-[340px]">
            <NitroCardHeaderView headerText={ LocalizeText("camera.confirm_phase.title") } onCloseClick={ event => processAction("close") } />
            <NitroCardContentView>
                <div className="flex size-80 items-center justify-center bg-[#CCCCCC] dark:bg-[#33312b]">
                    { (pictureUrl && pictureUrl.length) &&
                        <LayoutImage className="size-full" imageUrl={ pictureUrl } /> }
                    { (!pictureUrl || !pictureUrl.length) &&
                        <p className="text-[8px]xl font-semibold !leading-3 text-white [text-shadow:_0_1px_0_#CCCCCC]">{ LocalizeText("camera.loading") }</p> }
                </div>
                { pictureUrl && !wasPicturePublished && <p className="my-2.5 text-sm">{ LocalizeText("camera.confirm_phase.info") }</p> }
                { !pictureUrl && <p className="my-2.5 text-sm">{ LocalizeText("camera.purchase.pleasewait") }</p> }
                { wasPicturePublished && <p className="my-2.5 text-sm">{ LocalizeText("camera.publish.successful") }</p> }
                <div className="flex flex-col">
                    <div className="illumina-card-item flex w-full flex-col px-2.5 py-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="mb-1 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                                    { LocalizeText("camera.purchase.header") }
                                </p>
                                { ((price.credits > 0) || (price.duckets > 0)) &&
                                    <div className="flex items-center">
                                        <p className="text-sm">{ LocalizeText("catalog.purchase.confirmation.dialog.cost") }&nbsp;</p>
                                        { (price.credits > 0) &&
                                            <div className="flex items-center gap-[3px]">
                                                <p className="text-sm font-semibold">{ price.credits }</p>
                                                <LayoutCurrencyIcon type="big" currency={ -1 } />
                                            </div> }
                                        { (price.duckets > 0) &&
                                            <div className="flex items-center gap-[3px]">
                                                <p className="text-sm font-semibold">{ price.duckets }</p>
                                                <LayoutCurrencyIcon type="big" currency={ 5 } />
                                            </div> }
                                    </div> }
                            </div>
                            <Button variant="success" disabled={ isWaiting } onClick={ event => processAction("buy") }>{ LocalizeText(!picturesBought ? "buy" : "camera.buy.another.button.text") }</Button>
                        </div>
                        { (picturesBought > 0) &&
                            <div className="mt-1.5">
                                <p className="text-sm !leading-3">
                                    <b className="font-semibold">{ LocalizeText("camera.purchase.count.info") }</b> { picturesBought } <u className="ms-1 cursor-pointer" onClick={ () => CreateLinkEvent("inventory/toggle") }>{ LocalizeText("camera.open.inventory") }</u>
                                </p>
                            </div> }
                    </div>
                </div>
                { !publishDisabled &&
                    <div className="mt-1.5 flex flex-col">
                        <div className="illumina-card-item flex w-full items-end justify-between px-2.5 py-2">
                            <div className="max-w-[170px]">
                                <p className="mb-1 text-sm font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">
                                    { LocalizeText("camera.publish.explanation") }
                                </p>
                                <p className="mb-2 text-sm">
                                    { LocalizeText("camera.publish.detailed.explanation") }
                                </p>
                                { wasPicturePublished && <a className="text-sm underline" href={ publishUrl } rel="noreferrer" target="_blank">{ LocalizeText("camera.link.to.published") }</a> }
                                { !wasPicturePublished &&
                                    <div className="flex items-center">
                                        <p className="text-sm">{ LocalizeText("catalog.purchase.confirmation.dialog.cost") }&nbsp;</p>
                                        <div className="flex items-center gap-[3px]">
                                            <p className="text-sm font-semibold">{ price.publishDucketPrice }</p>
                                            <LayoutCurrencyIcon type="big" currency={ 5 } />
                                        </div>
                                    </div> }
                            </div>
                            { !wasPicturePublished &&
                                <Button variant="success" disabled={ (isWaiting || (publishCooldown > 0)) } onClick={ event => processAction("publish") }>
                                    { LocalizeText("camera.publish.button.text") }
                                </Button> }
                        </div>
                    </div> }
                <p className="mb-1.5 mt-2 text-sm">{ LocalizeText("camera.warning.disclaimer") }</p>
                <Button className="!w-fit" onClick={ event => processAction("cancel") }>{ LocalizeText("generic.close") }</Button>
            </NitroCardContentView>
        </NitroCardView>
    )
}
