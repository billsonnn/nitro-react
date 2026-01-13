import { IRoomUserData, PetTrainingMessageParser, PetTrainingPanelMessageEvent } from "@nitrots/nitro-renderer"
import { FC, useState } from "react"
import { LocalizeText } from "../../../../api"
import { Button, DraggableWindowPosition, LayoutPetImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from "../../../../common"
import { useMessageEvent, useRoom, useSessionInfo } from "../../../../hooks"

export const AvatarInfoPetTrainingPanelView: FC<{}> = props =>
{
    const [ petData, setPetData ] = useState<IRoomUserData>(null)
    const [ petTrainInformation, setPetTrainInformation ] = useState<PetTrainingMessageParser>(null)
    const { chatStyleId = 0 } = useSessionInfo()
    const { roomSession = null } = useRoom()

    useMessageEvent<PetTrainingPanelMessageEvent>(PetTrainingPanelMessageEvent, event =>
    {
        const parser = event.getParser()

        if (!parser) return

        const roomPetData = roomSession.userDataManager.getPetData(parser.petId)

        if(!roomPetData) return

        setPetData(roomPetData)
        setPetTrainInformation(parser)
    })

    const processPetAction = (petName: string, commandName: string) =>
    {
        if (!petName || !commandName) return

        roomSession?.sendChatMessage(`${ petName } ${ commandName }`, chatStyleId)
    }

    if(!petData || !petTrainInformation) return null

    return (
        <NitroCardView uniqueKey="pet-training" className="illumina-pet-training w-[195px]" windowPosition={ DraggableWindowPosition.TOP_LEFT }>
            <NitroCardHeaderView headerText={ LocalizeText("widgets.pet.commands.title") } onCloseClick={ () => setPetTrainInformation(null) } />
            <NitroCardContentView>
                <div className="mb-[9px] flex items-center gap-1.5">
                    <div className="body-image pet w-full overflow-hidden p-1">
                        <LayoutPetImageView figure={ petData.figure } posture={ "std" } direction={ 2 } />
                    </div>
                    <p className="text-sm">{ petData.name }</p>
                </div>
                <div className="grid grid-cols-2 gap-x-0.5 gap-y-[3px]">
                    {
                        (petTrainInformation.commands && petTrainInformation.commands.length > 0) && petTrainInformation.commands.map((command, index) =>
                            <Button key={ index } disabled={ !petTrainInformation.enabledCommands.includes(command) } onClick={ () => processPetAction(petData.name, LocalizeText(`pet.command.${ command }`)) }>{ LocalizeText(`pet.command.${ command }`) }</Button>
                        )
                    }
                </div>
            </NitroCardContentView>
        </NitroCardView>
    )
}
