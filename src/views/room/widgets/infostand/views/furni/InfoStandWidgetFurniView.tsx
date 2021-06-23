import { CrackableDataType, RoomControllerLevel, RoomWidgetEnumItemExtradataParameter, RoomWidgetFurniInfoUsagePolicyEnum, StringDataType } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { BadgeImageView } from '../../../../../badge-image/BadgeImageView';
import { LimitedEditionCompactPlateView } from '../../../../../limited-edition/compact-plate/LimitedEditionCompactPlateView';
import { useRoomContext } from '../../../../context/RoomContext';
import { RoomWidgetFurniActionMessage } from '../../../../messages';
import { InfoStandWidgetFurniViewProps } from './InfoStandWidgetFurniView.types';

const PICKUP_MODE_NONE: number = 0;
const PICKUP_MODE_EJECT: number = 1;
const PICKUP_MODE_FULL: number = 2;

export const InfoStandWidgetFurniView: FC<InfoStandWidgetFurniViewProps> = props =>
{
    const { furniData = null, close = null } = props;
    const { eventDispatcher = null, widgetHandler = null } = useRoomContext();
    
    const [ pickupMode, setPickupMode ] = useState(0);
    const [ canMove, setCanMove ] = useState(false);
    const [ canRotate, setCanRotate ] = useState(false);
    const [ canUse, setCanUse ] = useState(false);
    const [ furniSettingsKeys, setFurniSettingsKeys ] = useState<string[]>([]);
    const [ furniSettingsValues, setFurniSettingsValues ] = useState<string[]>([]);
    const [ isCrackable, setIsCrackable ] = useState(false);
    const [ crackableHits, setCrackableHits ] = useState(0);
    const [ crackableTarget, setCrackableTarget ] = useState(0);
    const [ godMode, setGodMode ] = useState(false);

    useEffect(() =>
    {
        let pickupMode = PICKUP_MODE_NONE;
        let canMove = false;
        let canRotate = false;
        let canUse = false;
        let furniSettings: string[] = [];
        let furniValues: string[] = [];
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
                            furniSettings.push(value[0]);
                            furniValues.push(value[1]);
                        }
                    }
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
        setFurniSettingsKeys(furniSettings);
        setFurniSettingsValues(furniValues);
        setIsCrackable(isCrackable);
        setCrackableHits(crackableHits);
        setCrackableTarget(crackableTarget);
        setGodMode(godMode);
    }, [ furniData ]);

    const openFurniGroupInfo = useCallback(() =>
    {

    }, []);

    const onFurniSettingChange = useCallback((index: number, value: string) =>
    {
        const clone = Array.from(furniSettingsValues);

        clone[index] = value;

        setFurniSettingsValues(clone);
    }, [ furniSettingsValues ]);

    const getFurniSettingsAsString = useCallback(() =>
    {
        if(furniSettingsKeys.length === 0 || furniSettingsValues.length === 0) return '';

        let data = '';

        let i = 0;

        while(i < furniSettingsKeys.length)
        {
            const key   = furniSettingsKeys[i];
            const value = furniSettingsValues[i];

            data = (data + (key + '=' + value + '\t'));

            i++;
        }

        return data;
    }, [ furniSettingsKeys, furniSettingsValues ]);

    const processButtonAction = useCallback((action: string) =>
    {
        if(!action || (action === '')) return;

        let messageType: string = null;
        let objectData: string  = null;

        switch(action)
        {
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
        }

        if(!messageType) return;

        widgetHandler.processWidgetMessage(new RoomWidgetFurniActionMessage(messageType, furniData.id, furniData.category, furniData.purchaseOfferId, objectData));
    }, [ furniData, pickupMode, widgetHandler, getFurniSettingsAsString ]);

    if(!furniData) return null;

    return (
        <>
            <div className="d-flex flex-column bg-dark nitro-card nitro-infostand rounded">
                <div className="container-fluid content-area">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="small text-wrap">{ furniData.name }</div>
                        <i className="fas fa-times cursor-pointer" onClick={ close }></i>
                    </div>
                    <hr className="m-0 my-1" />
                    <div className="position-relative w-100">
                        { furniData.stuffData.isUnique &&
                            <div className="position-absolute r-0">
                                <LimitedEditionCompactPlateView uniqueNumber={ furniData.stuffData.uniqueNumber } uniqueSeries={ furniData.stuffData.uniqueSeries } />
                            </div> }
                        { furniData.image.src.length && 
                            <img className="d-block mx-auto" src={ furniData.image.src } alt="" /> }
                    </div>
                    <hr className="m-0 my-1" />
                    <div className="small text-wrap">{ furniData.description }</div>
                    <hr className="m-0 my-1" />
                    <div className="d-flex align-items-center">
                        <i className="icon icon-user-profile me-1 cursor-pointer" />
                        <div className="small text-wrap">{ LocalizeText('furni.owner', [ 'name' ], [ furniData.ownerName ]) }</div>
                    </div>
                    { isCrackable &&
                        <>
                            <hr className="m-0 my-1" />
                            <div className="small text-wrap">{ LocalizeText('infostand.crackable_furni.hits_remaining', [ 'hits', 'target' ], [ crackableHits.toString(), crackableTarget.toString() ]) }</div>
                        </> }
                    { (furniData.groupId > 0) &&
                        <>
                            <hr className="m-0 my-1" />
                            <div className="badge badge-secondary mb-0" onClick={ openFurniGroupInfo }>
                                <BadgeImageView badgeCode={ (furniData.stuffData as StringDataType).getValue(2) } />
                            </div>
                        </> }
                    { godMode &&
                        <>
                            <hr className="m-0 my-1" />
                            <div className="small text-wrap">ID: { furniData.id }</div>
                            { (furniSettingsKeys.length > 0) &&
                                <>
                                    <hr className="m-0 my-1"/>
                                    { furniSettingsKeys.map((key, index) =>
                                        {
                                            return (
                                                <div key={ index } className="mb-1">
                                                    <div className="small text-wrap">{ key }</div>
                                                    <input type="text" className="form-control form-control-sm" value={ furniSettingsValues[index] } onChange={ event => onFurniSettingChange(index, event.target.value) }/>
                                                </div>);
                                        }) }
                                </> }
                        </> }
                </div>
            </div>
            <div className="button-container mt-2">
                { canMove &&
                    <button type="button" className="btn btn-sm btn-secondary" onClick={event => processButtonAction('move')}>
                        <i className="fas fa-arrows-alt me-1"></i>
                        { LocalizeText('infostand.button.move') }
                    </button> }
                { canRotate &&
                    <button type="button" className="btn btn-sm btn-secondary ms-1" onClick={event => processButtonAction('rotate')}>
                        <i className="fas fa-sync-alt me-1"></i>
                        { LocalizeText('infostand.button.rotate') }
                    </button> }
                { canUse &&
                    <button type="button" className="btn btn-sm btn-success ms-1" onClick={event => processButtonAction('use')}>
                        <i className="fas fa-mouse me-1"></i>
                        {LocalizeText('infostand.button.use')}
                    </button>}
                { (pickupMode !== PICKUP_MODE_NONE) &&
                    <button type="button" className="btn btn-sm btn-danger ms-1" onClick={event => processButtonAction('pickup')}>
                        <i className={ "me-1 " + (pickupMode === PICKUP_MODE_EJECT ? "fas fa-eject" : "fas fa-box-open") }></i>
                        { LocalizeText((pickupMode === PICKUP_MODE_EJECT) ? 'infostand.button.eject' : 'infostand.button.pickup') }
                    </button> }
                { ((furniSettingsKeys.length > 0 && furniSettingsValues.length > 0) && (furniSettingsKeys.length === furniSettingsValues.length)) &&
                    <button className="btn btn-sm btn-success ms-1" onClick={ () => processButtonAction('save_branding_configuration') }>
                        <i className="fas fa-save me-1"></i>
                        { LocalizeText('save') }
                    </button> }
            </div>
        </>
    );
}
