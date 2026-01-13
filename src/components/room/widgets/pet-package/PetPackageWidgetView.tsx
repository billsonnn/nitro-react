import { FC } from "react"
import { GetConfiguration, LocalizeText } from "../../../../api"
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { usePetPackageWidget } from "../../../../hooks"

export const PetPackageWidgetView: FC<{}> = props =>
{
    const { isVisible = false, errorResult = null, petName = null, objectType = null, onChangePetName = null, onConfirm = null, onClose = null } = usePetPackageWidget()

    return (
        <>
            { isVisible &&
                <NitroCardView uniqueKey="pet-package" className="illumina-pet-package w-[400px]">
                    <NitroCardHeaderView center headerText={ objectType === "gnome_box" ? LocalizeText("widgets.gnomepackage.name.title") : LocalizeText("furni.petpackage.open") } onCloseClick={ () => onClose() } />
                    <NitroCardContentView>
                        <div className="flex gap-1.5 pb-[15px]">
                            <div className={ `package-image-${ objectType } h-[84px] w-20 bg-no-repeat` }></div>
                            <div className="m-2">
                                <p className="mb-[9px] text-lg font-semibold [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("petpackage.header.title") }</p>
                                <p className="text-sm">{ LocalizeText("widgets.petpackage.name.select") }</p>
                            </div>
                        </div>
                        <div className="flex w-full flex-col px-3">
                            <div className="flex flex-col">
                                <div className="illumina-input relative mt-[15px] h-[34px] w-full">
                                    <input type="text" className="size-full bg-transparent pl-[9px] pr-[25px] font-semibold text-[#919191]" maxLength={ GetConfiguration("pet.package.name.max.length") } value={ petName } onChange={ event => onChangePetName(event.target.value) } />
                                    <i className="absolute right-[3px] top-[9px] h-[18px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-335px_0px] bg-no-repeat" />
                                </div>
                                <div className="flex items-center justify-center gap-[63px] pt-[15px]">
                                    <Button variant="underline" className="!text-sm" onClick={ () => onClose() }>{ LocalizeText("cancel") }</Button>
                                    <Button variant="success" className="!h-[33px] !text-sm" onClick={ () => onConfirm() }>{ LocalizeText("widgets.gnomepackage.name.pick") }</Button>
                                </div>
                            </div>
                        </div>
                    </NitroCardContentView>
                </NitroCardView>
            }
        </>
    )
}
