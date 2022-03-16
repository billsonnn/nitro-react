import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CrackableDataType, GroupInformationComposer, GroupInformationEvent, RoomControllerLevel, RoomObjectCategory, RoomObjectVariable, RoomWidgetEnumItemExtradataParameter, RoomWidgetFurniInfoUsagePolicyEnum, SetObjectDataMessageComposer, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateLinkEvent, GetGroupInformation, GetRoomEngine, LocalizeText, RoomWidgetFurniActionMessage, RoomWidgetUpdateInfostandFurniEvent, SendMessageComposer } from '../../../../api';
import { Button, Column, Flex, LayoutBadgeImageView, LayoutLimitedEditionCompactPlateView, LayoutRarityLevelView, Text, UserProfileIconView } from '../../../../common';
import { BatchUpdates, UseMessageEventHook } from '../../../../hooks';
import { useRoomContext } from '../../RoomContext';

interface InfoStandWidgetFurniViewProps
{
    furniData: RoomWidgetUpdateInfostandFurniEvent;
    close: () => void;
}

const PICKUP_MODE_NONE: number = 0;
const PICKUP_MODE_EJECT: number = 1;
const PICKUP_MODE_FULL: number = 2;

export const InfoStandWidgetFurniView: FC<InfoStandWidgetFurniViewProps> = props =>
{
    const { furniData = null, close = null } = props;
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();
    
    const [ pickupMode, setPickupMode ] = useState(0);
    const [ canMove, setCanMove ] = useState(false);
    const [ canRotate, setCanRotate ] = useState(false);
    const [ canUse, setCanUse ] = useState(false);
    const [ furniKeys, setFurniKeys ] = useState<string[]>([]);
    const [ furniValues, setFurniValues ] = useState<string[]>([]);
    const [ customKeys, setCustomKeys ] = useState<string[]>([]);
    const [ customValues, setCustomValues ] = useState<string[]>([]);
    const [ isCrackable, setIsCrackable ] = useState(false);
    const [ crackableHits, setCrackableHits ] = useState(0);
    const [ crackableTarget, setCrackableTarget ] = useState(0);
    const [ godMode, setGodMode ] = useState(false);
    const [ canSeeFurniId, setCanSeeFurniId ] = useState(false);
    const [ groupName, setGroupName ] = useState<string>(null);

    useEffect(() =>
    {
        let pickupMode = PICKUP_MODE_NONE;
        let canMove = false;
        let canRotate = false;
        let canUse = false;
        let furniKeyss: string[] = [];
        let furniValuess: string[] = [];
        let customKeyss: string[] = [];
        let customValuess: string[] = [];
        let isCrackable = false;
        let crackableHits = 0;
        let crackableTarget = 0;
        let godMode = false;
        let canSeeFurniId = false;
        
        const isValidController = (furniData.roomControllerLevel >= RoomControllerLevel.GUEST);

        if(isValidController || furniData.isOwner || furniData.isRoomOwner || furniData.isAnyRoomController)
        {
            canMove = true;
            canRotate = !furniData.isWallItem;

            if(furniData.roomControllerLevel >= RoomControllerLevel.MODERATOR) godMode = true;
        }

        if(furniData.isAnyRoomController)
        {
            canSeeFurniId = true;
        }
        
        if((((furniData.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum.EVERYBODY) || ((furniData.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum.CONTROLLER) && isValidController)) || ((furniData.extraParam === RoomWidgetEnumItemExtradataParameter.JUKEBOX) && isValidController)) || ((furniData.extraParam === RoomWidgetEnumItemExtradataParameter.USABLE_PRODUCT) && isValidController)) canUse = true;

        if(furniData.extraParam)
        {
            if(furniData.extraParam === RoomWidgetEnumItemExtradataParameter.CRACKABLE_FURNI)
            {
                const stuffData = (furniData.stuffData as CrackableDataType);

                canUse = true;
                isCrackable = true;
                crackableHits = stuffData.hits;
                crackableTarget = stuffData.target;
            }

            if(godMode)
            {
                const extraParam = furniData.extraParam.substr(RoomWidgetEnumItemExtradataParameter.BRANDING_OPTIONS.length);

                if(extraParam)
                {
                    const parts = extraParam.split('\t');

                    for(const part of parts)
                    {
                        const value = part.split('=');

                        if(value && (value.length === 2))
                        {
                            furniKeyss.push(value[0]);
                            furniValuess.push(value[1]);
                        }
                    }
                }
            }
        }

        const roomObject = GetRoomEngine().getRoomObject(roomSession.roomId, furniData.id, (furniData.isWallItem) ? RoomObjectCategory.WALL : RoomObjectCategory.FLOOR);

        if(roomObject)
        {
            const customVariables = roomObject.model.getValue<string[]>(RoomObjectVariable.FURNITURE_CUSTOM_VARIABLES);
            const furnitureData = roomObject.model.getValue<{ [index: string]: string }>(RoomObjectVariable.FURNITURE_DATA);

            if(customVariables && customVariables.length)
            {
                for(const customVariable of customVariables)
                {
                    customKeyss.push(customVariable);
                    customValuess.push((furnitureData[customVariable]) || '');
                }
            }
        }

        if(furniData.isOwner || furniData.isAnyRoomController) pickupMode = PICKUP_MODE_FULL;

        else if(furniData.isRoomOwner || (furniData.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN)) pickupMode = PICKUP_MODE_EJECT;

        if(furniData.isStickie) pickupMode = PICKUP_MODE_NONE;

        BatchUpdates(() =>
        {
            setPickupMode(pickupMode);
            setCanMove(canMove);
            setCanRotate(canRotate);
            setCanUse(canUse);
            setFurniKeys(furniKeyss);
            setFurniValues(furniValuess);
            setCustomKeys(customKeyss);
            setCustomValues(customValuess);
            setIsCrackable(isCrackable);
            setCrackableHits(crackableHits);
            setCrackableTarget(crackableTarget);
            setGodMode(godMode);
            setCanSeeFurniId(canSeeFurniId);
            setGroupName(null);
        });
        
        if(furniData.groupId) SendMessageComposer(new GroupInformationComposer(furniData.groupId, false));
    }, [ roomSession, furniData ]);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(!furniData || furniData.groupId !== parser.id || parser.flag) return;

        if(groupName) setGroupName(null);

        setGroupName(parser.title);
    }, [ furniData, groupName ]);

    UseMessageEventHook(GroupInformationEvent, onGroupInformationEvent);

    const onFurniSettingChange = useCallback((index: number, value: string) =>
    {
        const clone = Array.from(furniValues);

        clone[index] = value;

        setFurniValues(clone);
    }, [ furniValues ]);

    const onCustomVariableChange = useCallback((index: number, value: string) =>
    {
        const clone = Array.from(customValues);

        clone[index] = value;

        setCustomValues(clone);
    }, [ customValues ]);

    const getFurniSettingsAsString = useCallback(() =>
    {
        if(furniKeys.length === 0 || furniValues.length === 0) return '';

        let data = '';

        let i = 0;

        while(i < furniKeys.length)
        {
            const key   = furniKeys[i];
            const value = furniValues[i];

            data = (data + (key + '=' + value + '\t'));

            i++;
        }

        return data;
    }, [ furniKeys, furniValues ]);

    const processButtonAction = useCallback((action: string) =>
    {
        if(!action || (action === '')) return;

        let messageType: string = null;
        let objectData: string  = null;

        switch(action)
        {
            case 'buy_one':
                CreateLinkEvent(`catalog/open/offerId/${ furniData.purchaseOfferId }`);
                return;
            case 'move':
                messageType = RoomWidgetFurniActionMessage.MOVE;
                break;
            case 'rotate':
                messageType = RoomWidgetFurniActionMessage.ROTATE;
                break;
            case 'pickup':
                if(pickupMode === PICKUP_MODE_FULL) messageType = RoomWidgetFurniActionMessage.PICKUP;
                else messageType = RoomWidgetFurniActionMessage.EJECT;
                break;
            case 'use':
                messageType = RoomWidgetFurniActionMessage.USE;
                break;
            case 'save_branding_configuration':
                messageType = RoomWidgetFurniActionMessage.SAVE_STUFF_DATA;
                objectData = getFurniSettingsAsString();
                break;
            case 'save_custom_variables':
                const map = new Map();

                for(let i = 0; i < customKeys.length; i++)
                {
                    const key = customKeys[i];
                    const value = customValues[i];

                    if((key && key.length) && (value && value.length)) map.set(key, value);
                }

                SendMessageComposer(new SetObjectDataMessageComposer(furniData.id, map));
                break;
        }

        if(!messageType) return;

        widgetHandler.processWidgetMessage(new RoomWidgetFurniActionMessage(messageType, furniData.id, furniData.category, furniData.purchaseOfferId, objectData));
    }, [ widgetHandler, furniData, pickupMode, customKeys, customValues, getFurniSettingsAsString ]);

    const getGroupBadgeCode = useCallback(() =>
    {
        const stringDataType = (furniData.stuffData as StringDataType);

        if(!stringDataType || !(stringDataType instanceof StringDataType)) return null;

        return stringDataType.getValue(2);
    }, [ furniData ]);

    if(!furniData) return null;

    return (
        <Column gap={ 1 } alignItems="end">
            <Column className="nitro-infostand rounded">
                <Column overflow="visible" className="container-fluid content-area" gap={ 1 }>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                            <Text variant="white" small wrap>{ furniData.name }</Text>
                            <FontAwesomeIcon icon="times" className="cursor-pointer" onClick={ close } />
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex position="relative" gap={ 1 }>
                            { furniData.stuffData.isUnique &&
                                <div className="position-absolute end-0">
                                    <LayoutLimitedEditionCompactPlateView uniqueNumber={ furniData.stuffData.uniqueNumber } uniqueSeries={ furniData.stuffData.uniqueSeries } />
                                </div> }
                            { (furniData.stuffData.rarityLevel > -1) &&
                                <div className="position-absolute end-0">
                                    <LayoutRarityLevelView level={ furniData.stuffData.rarityLevel } />
                                </div> }
                            { furniData.image && furniData.image.src.length && 
                                <img className="d-block mx-auto" src={ furniData.image.src } alt="" /> }
                        </Flex>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Text fullWidth wrap textBreak variant="white" small>{ furniData.description }</Text>
                        <hr className="m-0" />
                    </Column>
                    <Column gap={ 1 }>
                        <Flex alignItems="center" gap={ 1 }>
                            <UserProfileIconView userId={ furniData.ownerId } />
                            <Text variant="white" small wrap>
                                { LocalizeText('furni.owner', [ 'name' ], [ furniData.ownerName ]) }
                            </Text>
                        </Flex>
                        { (furniData.purchaseOfferId > 0) &&
                            <Flex>
                                <Text variant="white" small underline pointer onClick={ event => processButtonAction('buy_one') }>
                                    { LocalizeText('infostand.button.buy') }
                                </Text>
                            </Flex> }
                    </Column>
                    <Column gap={ 1 }>
                        { isCrackable &&
                            <>
                                <hr className="m-0" />
                                <Text variant="white" small wrap>{ LocalizeText('infostand.crackable_furni.hits_remaining', [ 'hits', 'target' ], [ crackableHits.toString(), crackableTarget.toString() ]) }</Text>
                            </> }
                        { furniData.groupId > 0 &&
                            <>
                                <hr className="m-0" />
                                <Flex pointer alignItems="center" gap={ 2 } onClick={ () => GetGroupInformation(furniData.groupId) }>
                                    <LayoutBadgeImageView badgeCode={ getGroupBadgeCode() } isGroup={ true } />
                                    <Text variant="white" underline>{ groupName }</Text>
                                </Flex>
                            </> }
                        { godMode &&
                            <>
                                <hr className="m-0" />
                                { canSeeFurniId && <Text small wrap variant="white">ID: { furniData.id }</Text> }
                                { (furniKeys.length > 0) &&
                                    <>
                                        <hr className="m-0"/>
                                        <Column gap={ 1 }>
                                            { furniKeys.map((key, index) =>
                                                {
                                                    return (
                                                        <Flex key={ index } alignItems="center" gap={ 1 }>
                                                            <Text small wrap align="end" variant="white" className="col-4">{ key }</Text>
                                                            <input type="text" className="form-control form-control-sm" value={ furniValues[index] } onChange={ event => onFurniSettingChange(index, event.target.value) }/>
                                                        </Flex>);
                                                }) }
                                        </Column>
                                    </> }
                            </> }
                        { (customKeys.length > 0) &&
                            <>
                                <hr className="m-0 my-1"/>
                                <Column gap={ 1 }>
                                    { customKeys.map((key, index) =>
                                        {
                                            return (
                                                <Flex key={ index } alignItems="center" gap={ 1 }>
                                                    <Text small wrap align="end" variant="white" className="col-4">{ key }</Text>
                                                    <input type="text" className="form-control form-control-sm" value={ customValues[index] } onChange={ event => onCustomVariableChange(index, event.target.value) }/>
                                                </Flex>);
                                        }) }
                                </Column>
                            </> }
                    </Column>
                </Column>
            </Column>
            <Flex gap={ 1 } justifyContent="end">
                { canMove &&
                    <Button variant="dark" onClick={ event => processButtonAction('move') }>
                        { LocalizeText('infostand.button.move') }
                    </Button> }
                { canRotate &&
                    <Button variant="dark" onClick={ event => processButtonAction('rotate') }>
                        { LocalizeText('infostand.button.rotate') }
                    </Button> }
                { (pickupMode !== PICKUP_MODE_NONE) &&
                    <Button variant="dark" onClick={ event => processButtonAction('pickup') }>
                        { LocalizeText((pickupMode === PICKUP_MODE_EJECT) ? 'infostand.button.eject' : 'infostand.button.pickup') }
                    </Button> }
                { canUse &&
                    <Button variant="dark" onClick={ event => processButtonAction('use') }>
                        { LocalizeText('infostand.button.use') }
                    </Button>}
                { ((furniKeys.length > 0 && furniValues.length > 0) && (furniKeys.length === furniValues.length)) &&
                    <Button variant="dark" onClick={ () => processButtonAction('save_branding_configuration') }>
                        { LocalizeText('save') }
                    </Button> }
                { ((customKeys.length > 0 && customValues.length > 0) && (customKeys.length === customValues.length)) &&
                    <Button variant="dark" onClick={ () => processButtonAction('save_custom_variables') }>
                        { LocalizeText('save') }
                    </Button> }
            </Flex>
        </Column>
    );
}
