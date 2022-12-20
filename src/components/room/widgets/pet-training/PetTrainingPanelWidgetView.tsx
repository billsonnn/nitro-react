import { DesktopViewEvent, PetTrainingPanelMessageEvent } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { AvatarInfoPet, LocalizeText } from '../../../../api';
import { Button, Column, Flex, Grid, LayoutPetImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useAvatarInfoWidget, useMessageEvent, useRoom, useSessionInfo } from '../../../../hooks';

export const PetTrainingPanelWidgetView: FC<{}> = props =>
{
    const { avatarInfo = null, petTrainInformation = null, setPetTrainInformation = null } = useAvatarInfoWidget();
    const { chatStyleId = 0 } = useSessionInfo();
    const { roomSession = null } = useRoom();

    useMessageEvent<DesktopViewEvent>(DesktopViewEvent, event =>
    {
        setPetTrainInformation(null);
    });

    useMessageEvent<PetTrainingPanelMessageEvent>(PetTrainingPanelMessageEvent, event =>
    {
        const parser = event.getParser();

        if (!parser) return;

        setPetTrainInformation(parser);
    });

    const processPetAction = (petName: string, commandName: string) =>
    {
        if (!petName || !commandName) return;

        roomSession?.sendChatMessage(`${ petName } ${ commandName }`, chatStyleId);
    }

    if(!petTrainInformation) return null;

    return (
        <NitroCardView uniqueKey="user-settings" className="user-settings-window no-resize" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('widgets.pet.commands.title') } onCloseClick={ () => setPetTrainInformation(null) } />
            <NitroCardContentView className="text-black">
                <Flex alignItems="center" justifyContent="center" gap={ 2 }>
                    <Grid columnCount={ 2 }>
                        <Column fullWidth overflow="hidden" className="body-image pet p-1">
                            <LayoutPetImageView figure={ (avatarInfo as AvatarInfoPet)?.petFigure } posture={ (avatarInfo as AvatarInfoPet)?.posture } direction={ 2 } />
                        </Column>
                        <Text variant="black" small wrap>{ (avatarInfo as AvatarInfoPet)?.name }</Text>
                    </Grid>
                </Flex>
                <Grid columnCount={ 2 }>
                    {
                        (petTrainInformation.commands && petTrainInformation.commands.length > 0) && petTrainInformation.commands.map((command, index) =>
                            <Button key={ index } disabled={ !petTrainInformation.enabledCommands.includes(command) } onClick={ () => processPetAction((avatarInfo as AvatarInfoPet)?.name, LocalizeText(`pet.command.${ command }`)) }>{ LocalizeText(`pet.command.${ command }`) }</Button>
                        )
                    }
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
