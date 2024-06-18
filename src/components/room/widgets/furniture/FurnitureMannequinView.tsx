import { GetAvatarRenderManager, GetSessionDataManager, HabboClubLevelEnum, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetClubMemberLevel, GetRoomSession, LocalizeText, MannequinUtilities } from '../../../../api';
import { Button, Column, LayoutAvatarImageView, LayoutCurrencyIcon, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../common';
import { useFurnitureMannequinWidget } from '../../../../hooks';
import { NitroInput } from '../../../../layout';

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
                <div className="flex w-full gap-2 overflow-hidden">
                    <div className="flex flex-col">
                        <div className="relative mannequin-preview">
                            <LayoutAvatarImageView direction={ 2 } figure={ renderedFigure } position="absolute" />
                            { (clubLevel > 0) &&
                                <LayoutCurrencyIcon className="absolute end-2 bottom-2" type="hc" /> }
                        </div>
                    </div>
                    <Column grow justifyContent="between" overflow="auto">
                        { (mode === MODE_CONTROLLER) &&
                            <>
                                <NitroInput type="text" value={ name } onBlur={ saveName } onChange={ event => setName(event.target.value) } />
                                <div className="flex flex-col gap-1">
                                    <Button variant="success" onClick={ event => setMode(MODE_UPDATE) }>
                                        { LocalizeText('mannequin.widget.style') }
                                    </Button>
                                    <Button variant="success" onClick={ wearFigure }>
                                        { LocalizeText('mannequin.widget.wear') }
                                    </Button>
                                </div>
                            </> }
                        { (mode === MODE_UPDATE) &&
                            <>
                                <div className="flex flex-col gap-1">
                                    <Text bold>{ name }</Text>
                                    <Text wrap>{ LocalizeText('mannequin.widget.savetext') }</Text>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Text pointer underline onClick={ event => setMode(MODE_CONTROLLER) }>
                                        { LocalizeText('mannequin.widget.back') }
                                    </Text>
                                    <Button variant="success" onClick={ saveFigure }>
                                        { LocalizeText('mannequin.widget.save') }
                                    </Button>
                                </div>
                            </> }
                        { (mode === MODE_PEER) &&
                            <>
                                <div className="flex flex-col gap-1">
                                    <Text bold>{ name }</Text>
                                    <Text>{ LocalizeText('mannequin.widget.weartext') }</Text>
                                </div>
                                <Button variant="success" onClick={ wearFigure }>
                                    { LocalizeText('mannequin.widget.wear') }
                                </Button>
                            </> }
                        { (mode === MODE_NO_CLUB) &&
                            <div className="flex justify-center items-center !flex-grow">
                                <Text>{ LocalizeText('mannequin.widget.clubnotification') }</Text>
                            </div> }
                        { (mode === MODE_WRONG_GENDER) &&
                            <Text>{ LocalizeText('mannequin.widget.wronggender') }</Text> }
                    </Column>
                </div>
            </NitroCardContentView>
        </NitroCardView>
    );
};
