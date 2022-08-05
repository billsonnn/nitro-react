import { HabboClubLevelEnum, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetAvatarRenderManager, GetClubMemberLevel, GetRoomSession, GetSessionDataManager, LocalizeText, MannequinUtilities } from '../../../../api';
import { Base, Button, Column, Flex, LayoutAvatarImageView, LayoutCurrencyIcon, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFurnitureMannequinWidget } from '../../../../hooks';

const MODE_NONE: number = -1;
const MODE_CONTROLLER: number = 0;
const MODE_UPDATE: number = 1;
const MODE_PEER: number = 2;
const MODE_NO_CLUB: number = 3;
const MODE_WRONG_GENDER: number = 4;

export const FurnitureMannequinView: FC<{}> = props =>
{
    const [ renderedFigure, setRenderedFigure ] = useState<string>(null);
    const [ mode, setMode ] = useState(MODE_NONE);
    const { objectId = -1, figure = null, gender = null, clubLevel = HabboClubLevelEnum.NO_CLUB, name = null, setName = null, saveFigure = null, wearFigure = null, saveName = null, onClose = null } = useFurnitureMannequinWidget();

    useEffect(() =>
    {
        if(objectId === -1) return;

        const roomSession = GetRoomSession();

        if(roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator)
        {
            setMode(MODE_CONTROLLER);

            return;
        }
        
        if(GetSessionDataManager().gender.toLowerCase() !== gender.toLowerCase())
        {
            setMode(MODE_WRONG_GENDER);

            return;
        }

        if(GetClubMemberLevel() < clubLevel)
        {
            setMode(MODE_NO_CLUB);

            return;
        }
        
        setMode(MODE_PEER);
    }, [ objectId, gender, clubLevel ]);

    useEffect(() =>
    {
        switch(mode)
        {
            case MODE_CONTROLLER:
            case MODE_WRONG_GENDER: {
                const figureContainer = GetAvatarRenderManager().createFigureContainer(figure);

                MannequinUtilities.transformAsMannequinFigure(figureContainer);

                setRenderedFigure(figureContainer.getFigureString());
                break;
            }
            case MODE_UPDATE: {
                const figureContainer = GetAvatarRenderManager().createFigureContainer(GetSessionDataManager().figure);

                MannequinUtilities.transformAsMannequinFigure(figureContainer);

                setRenderedFigure(figureContainer.getFigureString());
                break;
            }
            case MODE_PEER:
            case MODE_NO_CLUB: {
                const figureContainer = MannequinUtilities.getMergedMannequinFigureContainer(GetSessionDataManager().figure, figure);

                setRenderedFigure(figureContainer.getFigureString());
                break;
            }
        }
    }, [ mode, figure, clubLevel ]);

    if(objectId === -1) return null;

    return (
        <NitroCardView className="nitro-mannequin no-resize" theme="primary-slim">
            <NitroCardHeaderView headerText={ LocalizeText('mannequin.widget.title') } onCloseClick={ onClose } />
            <NitroCardContentView center>
                <Flex fullWidth gap={ 2 } overflow="hidden">
                    <Column>
                        <Base position="relative" className="mannequin-preview">
                            <LayoutAvatarImageView position="absolute" figure={ renderedFigure } direction={ 2 } />
                            { (clubLevel > 0) &&
                                <LayoutCurrencyIcon className="position-absolute end-2 bottom-2" type="hc" /> }
                        </Base>
                    </Column>
                    <Column grow justifyContent="between" overflow="auto">
                        { (mode === MODE_CONTROLLER) &&
                            <>
                                <input type="text" className="form-control form-control-sm" value={ name } onChange={ event => setName(event.target.value) } onBlur={ saveName } />
                                <Column gap={ 1 }>
                                    <Button variant="success" onClick={ event => setMode(MODE_UPDATE) }>
                                        { LocalizeText('mannequin.widget.style') }
                                    </Button>
                                    <Button variant="success" onClick={ wearFigure }>
                                        { LocalizeText('mannequin.widget.wear') }
                                    </Button>
                                </Column>
                            </> }
                        { (mode === MODE_UPDATE) &&
                            <>
                                <Column gap={ 1 }>
                                    <Text bold>{ name }</Text>
                                    <Text wrap>{ LocalizeText('mannequin.widget.savetext') }</Text>
                                </Column>
                                <Flex alignItems="center" justifyContent="between">
                                    <Text underline pointer onClick={ event => setMode(MODE_CONTROLLER) }>
                                        { LocalizeText('mannequin.widget.back') }
                                    </Text>
                                    <Button variant="success" onClick={ saveFigure }>
                                        { LocalizeText('mannequin.widget.save') }
                                    </Button>
                                </Flex>
                            </> }
                        { (mode === MODE_PEER) &&
                            <>
                                <Column gap={ 1 }>
                                    <Text bold>{ name }</Text>
                                    <Text>{ LocalizeText('mannequin.widget.weartext') }</Text>
                                </Column>
                                <Button variant="success" onClick={ wearFigure }>
                                    { LocalizeText('mannequin.widget.wear') }
                                </Button>
                            </> }
                        { (mode === MODE_NO_CLUB) &&
                            <Flex center grow>
                                <Text>{ LocalizeText('mannequin.widget.clubnotification') }</Text>
                            </Flex> }
                        { (mode === MODE_WRONG_GENDER) &&
                            <Text>{ LocalizeText('mannequin.widget.wronggender') }</Text> }
                    </Column>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
