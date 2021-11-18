import { CrackableDataType, GroupInformationComposer, GroupInformationEvent, RoomControllerLevel, RoomObjectCategory, RoomObjectVariable, RoomWidgetEnumItemExtradataParameter, RoomWidgetFurniInfoUsagePolicyEnum, SetObjectDataMessageComposer, StringDataType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { CreateLinkEvent, GetGroupInformation, GetRoomEngine, LocalizeText, RoomWidgetFurniActionMessage } from '../../../../../../api';
import { CreateMessageHook, SendMessageHook } from '../../../../../../hooks';
import { UserProfileIconView } from '../../../../../../layout';
import { BadgeImageView } from '../../../../../shared/badge-image/BadgeImageView';
import { LimitedEditionCompactPlateView } from '../../../../../shared/limited-edition/compact-plate/LimitedEditionCompactPlateView';
import { RarityLevelView } from '../../../../../shared/rarity-level/RarityLevelView';
import { useRoomContext } from '../../../../context/RoomContext';
import { InfoStandBaseView } from '../base/InfoStandBaseView';
import { InfoStandWidgetFurniViewProps } from './InfoStandWidgetFurniView.types';

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
        
        const isValidController = (furniData.roomControllerLevel >= RoomControllerLevel.GUEST);

        if(isValidController || furniData.isOwner || furniData.isRoomOwner || furniData.isAnyRoomController)
        {
            canMove = true;
            canRotate = !furniData.isWallItem;

            if(furniData.roomControllerLevel >= RoomControllerLevel.MODERATOR) godMode = true;
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
        setGroupName(null);
        
        if(furniData.groupId) SendMessageHook(new GroupInformationComposer(furniData.groupId, false));
    }, [ roomSession, furniData ]);

    const onGroupInformationEvent = useCallback((event: GroupInformationEvent) =>
    {
        const parser = event.getParser();

        if(!furniData || furniData.groupId !== parser.id || parser.flag) return;

        if(groupName) setGroupName(null);

        setGroupName(parser.title);
    }, [ furniData, groupName ]);

    CreateMessageHook(GroupInformationEvent, onGroupInformationEvent);

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

                SendMessageHook(new SetObjectDataMessageComposer(furniData.id, map));
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
        <>
            <InfoStandBaseView headerText={ furniData.name } onCloseClick={ close }>
                <div className="position-relative w-100">
                    { furniData.stuffData.isUnique &&
                        <div className="position-absolute end-0">
                            <LimitedEditionCompactPlateView uniqueNumber={ furniData.stuffData.uniqueNumber } uniqueSeries={ furniData.stuffData.uniqueSeries } />
                        </div> }
                    { (furniData.stuffData.rarityLevel > -1) &&
                        <div className="position-absolute end-0">
                            <RarityLevelView level={ furniData.stuffData.rarityLevel } />
                        </div> }
                    { furniData.image.src.length && 
                        <img className="d-block mx-auto" src={ furniData.image.src } alt="" /> }
                </div>
                <hr className="m-0 my-1" />
                <div className="small text-wrap">{ furniData.description }</div>
                <hr className="m-0 my-1" />
                <div className="d-flex align-items-center">
                    <UserProfileIconView userId={ furniData.ownerId } />
                    <div className="small text-wrap">{ LocalizeText('furni.owner', [ 'name' ], [ furniData.ownerName ]) }</div>
                </div>
                { (furniData.purchaseOfferId > 0) && <button type="button" className="btn btn-primary btn-sm mt-1" onClick={ event => processButtonAction('buy_one') }>{ LocalizeText('infostand.button.buy') }</button> }
                { isCrackable &&
                    <>
                        <hr className="m-0 my-1" />
                        <div className="small text-wrap">{ LocalizeText('infostand.crackable_furni.hits_remaining', [ 'hits', 'target' ], [ crackableHits.toString(), crackableTarget.toString() ]) }</div>
                    </> }
                { furniData.groupId > 0 &&
                    <>
                        <hr className="m-0 my-1" />
                        <div className="d-flex align-items-center cursor-pointer text-decoration-underline gap-2" onClick={ () => GetGroupInformation(furniData.groupId) }>
                            <BadgeImageView badgeCode={ getGroupBadgeCode() } isGroup={ true } />
                            <div>{ groupName }</div>
                        </div>
                    </> }
                { godMode &&
                    <>
                        <hr className="m-0 my-1" />
                        <div className="small text-wrap">ID: { furniData.id }</div>
                        { (furniKeys.length > 0) &&
                            <>
                                <hr className="m-0 my-1"/>
                                { furniKeys.map((key, index) =>
                                    {
                                        return (
                                            <div key={ index } className="mb-1">
                                                <div className="small text-wrap">{ key }</div>
                                                <input type="text" className="form-control form-control-sm" value={ furniValues[index] } onChange={ event => onFurniSettingChange(index, event.target.value) }/>
                                            </div>);
                                    }) }
                            </> }
                    </> }
                { (customKeys.length > 0) &&
                    <>
                        <hr className="m-0 my-1"/>
                        { customKeys.map((key, index) =>
                            {
                                return (
                                    <div key={ index } className="mb-1">
                                        <div className="small text-wrap">{ key }</div>
                                        <input type="text" className="form-control form-control-sm" value={ customValues[index] } onChange={ event => onCustomVariableChange(index, event.target.value) }/>
                                    </div>);
                            }) }
                    </> }
            </InfoStandBaseView>
            <div className="button-container mt-2">
                { canMove &&
                    <button type="button" className="btn btn-sm btn-dark" onClick={ event => processButtonAction('move') }>
                        { LocalizeText('infostand.button.move') }
                    </button> }
                { canRotate &&
                    <button type="button" className="btn btn-sm btn-dark ms-1" onClick={ event => processButtonAction('rotate') }>
                        { LocalizeText('infostand.button.rotate') }
                    </button> }
                { canUse &&
                    <button type="button" className="btn btn-sm btn-dark ms-1" onClick={ event => processButtonAction('use') }>
                        { LocalizeText('infostand.button.use') }
                    </button>}
                { (pickupMode !== PICKUP_MODE_NONE) &&
                    <button type="button" className="btn btn-sm btn-dark ms-1" onClick={ event => processButtonAction('pickup') }>
                        { LocalizeText((pickupMode === PICKUP_MODE_EJECT) ? 'infostand.button.eject' : 'infostand.button.pickup') }
                    </button> }
                { ((furniKeys.length > 0 && furniValues.length > 0) && (furniKeys.length === furniValues.length)) &&
                    <button className="btn btn-sm btn-dark ms-1" onClick={ () => processButtonAction('save_branding_configuration') }>
                        { LocalizeText('save') }
                    </button> }
                { ((customKeys.length > 0 && customValues.length > 0) && (customKeys.length === customValues.length)) &&
                    <button className="btn btn-sm btn-dark ms-1" onClick={ () => processButtonAction('save_custom_variables') }>
                        Set values
                    </button> }
            </div>
        </>
    );
}
