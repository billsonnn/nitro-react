import { IRoomUserData, PetTrainingMessageParser, PetTrainingPanelMessageEvent } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Column, Flex, Grid, LayoutPetImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useMessageEvent, useRoom, useSessionInfo } from '../../../../hooks';

export const AvatarInfoPetTrainingPanelView: FC<{}> = props =>
{
    const [ petData, setPetData ] = useState<IRoomUserData>(null);
    const [ petTrainInformation, setPetTrainInformation ] = useState<PetTrainingMessageParser>(null);
    const { chatStyleId = 0 } = useSessionInfo();
    const { roomSession = null } = useRoom();

    useMessageEvent<PetTrainingPanelMessageEvent>(PetTrainingPanelMessageEvent, event =>
    {
        const parser = event.getParser();

        if(!parser) return;

        const roomPetData = roomSession.userDataManager.getPetData(parser.petId);

        if(!roomPetData) return;

        setPetData(roomPetData);
        setPetTrainInformation(parser);
    });

    const processPetAction = (petName: string, commandName: string) =>
    {
        if(!petName || !commandName) return;

        roomSession?.sendChatMessage(`${ petName } ${ commandName }`, chatStyleId);
    };

    if(!petData || !petTrainInformation) return null;

    return (
        <NitroCardView className="user-settings-window no-resize" theme="primary-slim" uniqueKey="user-settings">
            <NitroCardHeaderView headerText={ LocalizeText('widgets.pet.commands.title') } onCloseClick={ () => setPetTrainInformation(null) } />
            <NitroCardContentView className="text-black">
                <Flex alignItems="center" gap={ 2 } justifyContent="center">
                    <Grid columnCount={ 2 }>
                        <Column fullWidth className="body-image pet p-1" overflow="hidden">
                            <LayoutPetImageView direction={ 2 } figure={ petData.figure } posture={ 'std' } />
                        </Column>
                        <Text small wrap variant="black">{ petData.name }</Text>
                    </Grid>
                </Flex>
                <Grid columnCount={ 2 }>
                    {
                        (petTrainInformation.commands && petTrainInformation.commands.length > 0) && petTrainInformation.commands.map((command, index) =>
                            <Button key={ index } disabled={ !petTrainInformation.enabledCommands.includes(command) } onClick={ () => processPetAction(petData.name, LocalizeText(`pet.command.${ command }`)) }>{ LocalizeText(`pet.command.${ command }`) }</Button>
                        )
                    }
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
