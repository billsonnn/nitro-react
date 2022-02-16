import { AvatarFigurePartType, FurnitureMannequinSaveLookComposer, FurnitureMannequinSaveNameComposer, FurnitureMultiStateComposer, HabboClubLevelEnum, IAvatarFigureContainer, RoomControllerLevel } from '@nitrots/nitro-renderer';
import { FC, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { GetAvatarRenderManager, GetSessionDataManager, LocalizeText, RoomWidgetUpdateMannequinEvent } from '../../../../../api';
import { Button } from '../../../../../common/Button';
import { Column } from '../../../../../common/Column';
import { Flex } from '../../../../../common/Flex';
import { Grid } from '../../../../../common/Grid';
import { Text } from '../../../../../common/Text';
import { BatchUpdates, SendMessageHook } from '../../../../../hooks';
import { CreateEventDispatcherHook } from '../../../../../hooks/events/event-dispatcher.base';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../../layout';
import { useRoomContext } from '../../../context/RoomContext';
import { FurnitureMannequinPreviewView } from './views/preview/FurnitureMannequinPreviewView';

const MODE_NONE: number = -1;
const MODE_CONTROLLER: number = 0;
const MODE_UPDATE: number = 1;
const MODE_PEER: number = 2;
const MODE_NO_CLUB: number = 3;
const MODE_WRONG_GENDER: number = 4;

const ACTION_SET_NAME: number = 1;
const ACTION_WEAR: number = 2;
const ACTION_SAVE: number = 3;

const MANNEQUIN_FIGURE = ['hd', 99999, [ 99998 ]];
const MANNEQUIN_CLOTHING_PART_TYPES = [
    AvatarFigurePartType.CHEST_ACCESSORY,
    AvatarFigurePartType.COAT_CHEST,
    AvatarFigurePartType.CHEST,
    AvatarFigurePartType.LEGS,
    AvatarFigurePartType.SHOES,
    AvatarFigurePartType.WAIST_ACCESSORY
];

export const FurnitureMannequinView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ figure, setFigure ] = useState<string>(null);
    const [ gender, setGender ] = useState<string>(null);
    const [ name, setName ] = useState<string>(null);
    const [ clubLevel, setClubLevel ] = useState(HabboClubLevelEnum.NO_CLUB);
    const [ renderedFigure, setRenderedFigure ] = useState<string>(null);
    const [ renderedClubLevel, setRenderedClubLevel ] = useState(HabboClubLevelEnum.NO_CLUB);
    const [ mode, setMode ] = useState(MODE_NONE);
    const { roomSession = null, eventDispatcher = null } = useRoomContext();

    const onRoomWidgetUpdateMannequinEvent = useCallback((event: RoomWidgetUpdateMannequinEvent) =>
    {
        const figureContainer = GetAvatarRenderManager().createFigureContainer(event.figure);
        const figureClubLevel = GetAvatarRenderManager().getFigureClubLevel(figureContainer, event.gender, MANNEQUIN_CLOTHING_PART_TYPES);

        BatchUpdates(() =>
        {
            setObjectId(event.objectId);
            setFigure(event.figure);
            setGender(event.gender);
            setName(event.name);
            setClubLevel(figureClubLevel);

            if(roomSession.isRoomOwner || (roomSession.controllerLevel >= RoomControllerLevel.GUEST) || GetSessionDataManager().isModerator)
            {
                setMode(MODE_CONTROLLER);
            }

            else if(GetSessionDataManager().gender.toLowerCase() !== event.gender.toLowerCase())
            {
                setMode(MODE_WRONG_GENDER);
            }

            else if(GetSessionDataManager().clubLevel < figureClubLevel)
            {
                setMode(MODE_NO_CLUB);
            }
            else
            {
                setMode(MODE_PEER);
            }
        });
    }, [ roomSession ]);

    CreateEventDispatcherHook(RoomWidgetUpdateMannequinEvent.MANNEQUIN_UPDATE, eventDispatcher, onRoomWidgetUpdateMannequinEvent);

    const getMergedFigureContainer = (figure: string, targetFigure: string) =>
    {
        const figureContainer = GetAvatarRenderManager().createFigureContainer(figure);
        const targetFigureContainer = GetAvatarRenderManager().createFigureContainer(targetFigure);

        for(const part of MANNEQUIN_CLOTHING_PART_TYPES) figureContainer.removePart(part);

        for(const part of targetFigureContainer.getPartTypeIds())
        {
            figureContainer.updatePart(part, targetFigureContainer.getPartSetId(part), targetFigureContainer.getPartColorIds(part));
        }

        return figureContainer;
    }

    const transformAsMannequinFigure = (figureContainer: IAvatarFigureContainer) =>
    {
        for(const part of figureContainer.getPartTypeIds())
        {
            if(MANNEQUIN_CLOTHING_PART_TYPES.indexOf(part) >= 0) continue;
            
            figureContainer.removePart(part);
        }
    
        figureContainer.updatePart((MANNEQUIN_FIGURE[0] as string), (MANNEQUIN_FIGURE[1] as number), (MANNEQUIN_FIGURE[2] as number[]));
    };

    const processAction = useCallback((action: number, value: string = null) =>
    {
        switch(action)
        {
            case ACTION_SAVE:
                SendMessageHook(new FurnitureMannequinSaveLookComposer(objectId));
                break;
            case ACTION_WEAR:
                SendMessageHook(new FurnitureMultiStateComposer(objectId));
                break;
            case ACTION_SET_NAME:
                SendMessageHook(new FurnitureMannequinSaveNameComposer(objectId, name));
                return;
        }

        setMode(MODE_NONE);
    }, [ objectId, name ]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        processAction(ACTION_SET_NAME);
    };

    useEffect(() =>
    {
        switch(mode)
        {
            case MODE_CONTROLLER:
            case MODE_WRONG_GENDER: {
                const figureContainer = GetAvatarRenderManager().createFigureContainer(figure);

                transformAsMannequinFigure(figureContainer);

                setRenderedFigure(figureContainer.getFigureString());
                setRenderedClubLevel(clubLevel);
                break;
            }
            case MODE_UPDATE: {
                const figureContainer = GetAvatarRenderManager().createFigureContainer(GetSessionDataManager().figure);

                transformAsMannequinFigure(figureContainer);

                setRenderedFigure(figureContainer.getFigureString());
                setRenderedClubLevel(GetAvatarRenderManager().getFigureClubLevel(figureContainer, GetSessionDataManager().gender, MANNEQUIN_CLOTHING_PART_TYPES));
                break;
            }
            case MODE_PEER:
            case MODE_NO_CLUB: {
                const figureContainer = getMergedFigureContainer(GetSessionDataManager().figure, figure);

                setRenderedFigure(figureContainer.getFigureString());
                setRenderedClubLevel(clubLevel);
                break;
            }
        }
    }, [ mode, figure, clubLevel ]);

    if(mode === MODE_NONE) return null;

    return (
        <NitroCardView className="nitro-mannequin" simple={ true }>
            <NitroCardHeaderView headerText={ LocalizeText('mannequin.widget.title') } onCloseClick={ event => setMode(MODE_NONE) } />
            <NitroCardContentView>
                <Grid>
                    <Column center size={ 4 } overflow="hidden">
                        <FurnitureMannequinPreviewView figure={ renderedFigure } clubLevel={ renderedClubLevel } />
                    </Column>
                    <Column size={ 8 } justifyContent="between" overflow="hidden">
                        { (mode === MODE_CONTROLLER) &&
                            <>
                                <input type="text" className="form-control" value={ name } onChange={ event => setName(event.target.value) } onKeyDown={ event => handleKeyDown(event) } />
                                <Column gap={ 1 } overflow="auto">
                                    <Button variant="success" onClick={ event => setMode(MODE_UPDATE) }>
                                        { LocalizeText('mannequin.widget.style') }
                                    </Button>
                                    <Button variant="success" onClick={ event => processAction(ACTION_WEAR) }>
                                        { LocalizeText('mannequin.widget.wear') }
                                    </Button>
                                </Column>
                            </> }
                        { (mode === MODE_UPDATE) &&
                            <>
                                <Column gap={ 1 } overflow="auto">
                                    <Text fontWeight="bold">{ name }</Text>
                                    <Text>{ LocalizeText('mannequin.widget.savetext') }</Text>
                                </Column>
                                <Flex alignItems="center" justifyContent="between">
                                    <Text underline pointer onClick={ event => setMode(MODE_CONTROLLER) }>
                                        { LocalizeText('mannequin.widget.back') }
                                    </Text>
                                    <Button variant="success" onClick={ event => processAction(ACTION_SAVE) }>
                                        { LocalizeText('mannequin.widget.save') }
                                    </Button>
                                </Flex>
                            </> }
                        { (mode === MODE_PEER) &&
                            <>
                                <Column gap={ 1 } overflow="auto">
                                    <Text fontWeight="bold">{ name }</Text>
                                    <Text>{ LocalizeText('mannequin.widget.weartext') }</Text>
                                </Column>
                                <Button variant="success" onClick={ event => processAction(ACTION_WEAR) }>
                                    { LocalizeText('mannequin.widget.wear') }
                                </Button>
                            </> }
                        { (mode === MODE_NO_CLUB) && <Text>{ LocalizeText('mannequin.widget.clubnotification') }</Text> }
                        { (mode === MODE_WRONG_GENDER) && <Text>{ LocalizeText('mannequin.widget.wronggender') }</Text> }
                    </Column>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
}
