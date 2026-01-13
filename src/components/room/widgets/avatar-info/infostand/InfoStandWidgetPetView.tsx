import { PetRespectComposer, PetType } from "@nitrots/nitro-renderer"
import { FC, useEffect, useMemo, useState } from "react"
import { AvatarInfoPet, ConvertSeconds, CreateLinkEvent, GetConfiguration, GetSessionDataManager, LocalizeText, SendMessageComposer } from "../../../../../api"
import { Button, LayoutCounterTimeView, LayoutPetImageView, LayoutRarityLevelView } from "../../../../../common"
import { LayoutTimesView } from "../../../../../common/layout/LayoutTimesView"
import { useRoom, useSessionInfo } from "../../../../../hooks"

interface InfoStandWidgetPetViewProps
{
    avatarInfo: AvatarInfoPet;
    onClose: () => void;
}

export const InfoStandWidgetPetView: FC<InfoStandWidgetPetViewProps> = props =>
{
    const { avatarInfo = null, onClose = null } = props
    const [ remainingGrowTime, setRemainingGrowTime ] = useState(0)
    const [ remainingTimeToLive, setRemainingTimeToLive ] = useState(0)
    const { roomSession = null } = useRoom()
    const { petRespectRemaining = 0, respectPet = null } = useSessionInfo()

    const canPickUp = useMemo(() =>
    {
        return (roomSession.isRoomOwner || (GetSessionDataManager().isModerator))
    }, [ roomSession ])

    useEffect(() =>
    {
        setRemainingGrowTime(avatarInfo.remainingGrowTime)
        setRemainingTimeToLive(avatarInfo.remainingTimeToLive)
    }, [ avatarInfo ])

    useEffect(() =>
    {
        if((avatarInfo.petType !== PetType.MONSTERPLANT) || avatarInfo.dead) return

        const interval = setInterval(() =>
        {
            setRemainingGrowTime(prevValue => (prevValue - 1))
            setRemainingTimeToLive(prevValue => (prevValue - 1))
        }, 1000)

        return () => clearInterval(interval)
    }, [ avatarInfo ])

    if(!avatarInfo) return null

    const processButtonAction = (action: string) =>
    {
        let hideMenu = true

        if (!action || action === "") return

        switch (action)
        {
        case "respect":
            respectPet(avatarInfo.id)

            if((petRespectRemaining - 1) >= 1) hideMenu = false
            break
        case "buyfood":
            CreateLinkEvent("catalog/open/" + GetConfiguration("catalog.links")["pets.buy_food"])
            break
        case "train":
            roomSession?.requestPetCommands(avatarInfo.id)
            break
        case "treat":
            SendMessageComposer(new PetRespectComposer(avatarInfo.id))
            break
        case "compost":
            roomSession?.compostPlant(avatarInfo.id)
            break
        case "pick_up":
            roomSession?.pickupPet(avatarInfo.id)
            break
        }

        if(hideMenu) onClose()
    }

    return (
        <div className="relative flex flex-col items-end">
            <div className="illumina-card relative w-[206px] px-2.5 py-1.5">
                <div className="flex flex-col">
                    <div className="flex items-end justify-between">
                        <p className="text-[13px] font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ avatarInfo.name }</p>
                        <LayoutTimesView onClick={ onClose } />
                    </div>
                    { (avatarInfo.petType !== PetType.MONSTERPLANT) && <p className="text-[13px] !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText(`pet.breed.${ avatarInfo.petType }.${ avatarInfo.petBreed }`) }</p> }
                    <div className="mb-[7px] mt-[3px] h-0.5 w-full border-b border-white bg-[#CCCCCC] dark:border-[#36322C] dark:bg-black" />
                    { (avatarInfo.petType === PetType.MONSTERPLANT) &&
                        <>
                            <div className="mb-[46px] flex flex-col">
                                <div className="mb-2.5 flex">
                                    <div className="flex w-[82px] items-center justify-center">
                                        <LayoutPetImageView figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } direction={ 2 } />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-col items-center">
                                        <p className="mb-1 text-[13px]">{ LocalizeText("infostand.pet.text.wellbeing") }</p>
                                        <div className="relative h-4 w-40 border border-[#CCCCCC]">
                                            <p className="absolute -top-px w-full text-center text-xs">{ avatarInfo.dead ? "00:00:00" : ConvertSeconds((remainingTimeToLive === 0 ? avatarInfo.remainingTimeToLive : remainingTimeToLive)).split(":")[1] + ":" + ConvertSeconds((remainingTimeToLive === null || remainingTimeToLive === undefined ? 0 : remainingTimeToLive)).split(":")[2] + ":" + ConvertSeconds((remainingTimeToLive === null || remainingTimeToLive === undefined ? 0 : remainingTimeToLive)).split(":")[3] }</p>
                                            <div className="h-full bg-[url('/client-assets/images/infostand/pet-energy-bg.png?v=2451779')]" style={ { width: avatarInfo.dead ? "0" : Math.round((avatarInfo.maximumTimeToLive * 100) / (remainingTimeToLive)).toString() + "px" } } />
                                            <i className="absolute -left-2.5 -top-0.5 size-[18px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-305px_-84px]" />
                                        </div>
                                    </div>
                                    { remainingGrowTime !== 0 && remainingGrowTime > 0 &&
                                        <div className="flex flex-col items-center">
                                            <p className="mb-1 text-[13px]">{ LocalizeText("infostand.pet.text.growth") }</p>
                                            <LayoutCounterTimeView day={ ConvertSeconds(remainingGrowTime).split(":")[0] } hour={ ConvertSeconds(remainingGrowTime).split(":")[1] } minutes={ ConvertSeconds(remainingGrowTime).split(":")[2] } seconds={ ConvertSeconds(remainingGrowTime).split(":")[3] } />
                                        </div> }
                                    <div className="flex flex-col items-center">
                                        <p className="mb-1 text-[13px]">{ LocalizeText("infostand.pet.text.raritylevel", [ "level" ], [ LocalizeText(`infostand.pet.raritylevel.${ avatarInfo.rarityLevel }`) ]) }</p>
                                        <LayoutRarityLevelView level={ avatarInfo.rarityLevel } />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <p className="text-[13px]">{ LocalizeText("pet.age", [ "age" ], [ avatarInfo.age.toString() ]) }</p>
                                <p className="text-[13px]">{ LocalizeText("infostand.text.petowner", [ "name" ], [ avatarInfo.ownerName ]) }</p>
                            </div>
                        </> }
                    { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                        <>
                            <div className="mb-[46px] flex flex-col">
                                <div className="mb-[3px] flex">
                                    <div className="flex w-[82px] items-center justify-center">
                                        <LayoutPetImageView figure={ avatarInfo.petFigure } posture={ avatarInfo.posture } direction={ 2 } />
                                    </div>
                                    <div className="pt-[2%]">
                                        <p className="text-[13px]">{ LocalizeText("pet.level", [ "level", "maxlevel" ], [ avatarInfo.level.toString(), avatarInfo.maximumLevel.toString() ]) }</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-col items-center">
                                        <p className="mb-1 text-[13px]">{ LocalizeText("infostand.pet.text.happiness") }</p>
                                        <div className="relative h-4 w-40 border border-[#CCCCCC]">
                                            <p className="absolute -top-px w-full text-center text-xs">{ avatarInfo.happyness + "/" + avatarInfo.maximumHappyness }</p>
                                            <div className="h-full bg-[url('/client-assets/images/infostand/pet-happiness-bg.png?v=2451779')]" style={ { width: (avatarInfo.happyness / avatarInfo.maximumHappyness) * 100 + "%" } } />
                                            <i className="absolute -left-2.5 -top-0.5 size-[18px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-324px_-84px]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="mb-1 text-[13px]">{ LocalizeText("infostand.pet.text.experience") }</p>
                                        <div className="relative h-4 w-40 border border-[#CCCCCC]">
                                            <p className="absolute -top-px w-full text-center text-xs">{ avatarInfo.experience + "/" + avatarInfo.levelExperienceGoal }</p>
                                            <div className="h-full bg-[url('/client-assets/images/infostand/pet-experience-bg.png?v=2451779')]" style={ { width: (avatarInfo.experience / avatarInfo.levelExperienceGoal) * 100 + "%" } } />
                                            <i className="absolute -left-2.5 -top-0.5 size-[18px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-343px_-84px]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="mb-1 text-[13px]">{ LocalizeText("infostand.pet.text.energy") }</p>
                                        <div className="relative h-4 w-40 border border-[#CCCCCC]">
                                            <p className="absolute -top-px w-full text-center text-xs">{ avatarInfo.energy + "/" + avatarInfo.maximumEnergy }</p>
                                            <div className="h-full bg-[url('/client-assets/images/infostand/pet-energy-bg.png?v=2451779')]" style={ { width: (avatarInfo.energy / avatarInfo.maximumEnergy) * 100 + "%" } } />
                                            <i className="absolute -left-2.5 -top-0.5 size-[18px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-362px_-84px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="flex items-center gap-[3px]">
                                    <p className="text-[13px]">{ LocalizeText("infostand.text.petrespect", [ "count" ], [ avatarInfo.respect.toString() ]) }</p>
                                    <i className="h-[21px] w-[13px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-381px_-84px]" />
                                </div>
                                <p className="text-[13px]">{ LocalizeText("pet.age", [ "age" ], [ avatarInfo.age.toString() ]) }</p>
                                <p className="text-[13px]">{ LocalizeText("infostand.text.petowner", [ "name" ], [ avatarInfo.ownerName ]) }</p>
                            </div>
                        </> }
                </div>
            </div>
            <div className="mt-1 flex items-center justify-end gap-1">
                { !avatarInfo.dead && ((avatarInfo.energy / avatarInfo.maximumEnergy) < 0.98) && (avatarInfo.petType === PetType.MONSTERPLANT) &&
                    <Button variant="primary" className="w-fit !px-2" onClick={ event => processButtonAction("treat") }>
                        { LocalizeText("infostand.button.pettreat") }
                    </Button> }
                { roomSession?.isRoomOwner && avatarInfo.dead && (avatarInfo.petType === PetType.MONSTERPLANT) &&
                    <Button variant="primary" className="w-fit !px-2" onClick={ event => processButtonAction("compost") }>
                        { LocalizeText("infostand.button.compost") }
                    </Button> }
                { (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                    <Button variant="primary" className="w-fit !px-2" onClick={ event => processButtonAction("buyfood") }>
                        { LocalizeText("infostand.button.buyfood") }
                    </Button> }
                { avatarInfo.isOwner && (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                    <Button variant="primary" className="w-fit !px-2" onClick={ event => processButtonAction("train") }>
                        { LocalizeText("infostand.button.train") }
                    </Button> }
                { canPickUp &&
                    <Button variant="primary" className="w-fit !px-2" onClick={ event => processButtonAction("pick_up") }>
                        { LocalizeText("infostand.button.pickup") }
                    </Button> }
                { (petRespectRemaining > 0) && (avatarInfo.petType !== PetType.MONSTERPLANT) &&
                    <Button variant="primary" className="w-fit !px-2" onClick={ event => processButtonAction("respect") }>
                        { LocalizeText("infostand.button.petrespect", [ "count" ], [ petRespectRemaining.toString() ]) }
                    </Button> }
            </div>
        </div>
    )
}
