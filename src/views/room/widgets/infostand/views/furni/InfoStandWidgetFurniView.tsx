import { CrackableDataType, RoomControllerLevel, RoomWidgetEnumItemExtradataParameter, RoomWidgetFurniInfoUsagePolicyEnum, StringDataType } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { FurniAction, ProcessFurniAction } from '../../../../../../api';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { BadgeImageView } from '../../../../../badge-image/BadgeImageView';
import { LimitedEditionCompactPlateView } from '../../../../../limited-edition/compact-plate/LimitedEditionCompactPlateView';
import { InfoStandWidgetFurniViewProps } from './InfoStandWidgetFurniView.types';

const PICKUP_MODE_NONE: number = 0;
const PICKUP_MODE_EJECT: number = 1;
const PICKUP_MODE_FULL: number = 2;

export const InfoStandWidgetFurniView: FC<InfoStandWidgetFurniViewProps> = props =>
{
    const { furniData = null, close = null } = props;
    
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
        setPickupMode(0);
        setCanMove(false);
        setCanRotate(false);
        setCanUse(false);
        setFurniSettingsKeys([]);
        setFurniSettingsValues([]);
        setIsCrackable(false);
        setCrackableHits(0);
        setCrackableTarget(0);
        setGodMode(false);
        
        const isValidController = (furniData.roomControllerLevel >= RoomControllerLevel.GUEST);

        if(isValidController || furniData.isOwner || furniData.isRoomOwner || furniData.isAnyRoomController)
        {
            setCanMove(true);
            setCanRotate(!furniData.isWallItem);

            if(furniData.roomControllerLevel >= RoomControllerLevel.MODERATOR) setGodMode(true);
        }
        else

        if((((furniData.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum.EVERYBODY) || ((furniData.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum.CONTROLLER) && isValidController)) || ((furniData.extraParam === RoomWidgetEnumItemExtradataParameter.JUKEBOX) && isValidController)) || ((furniData.extraParam === RoomWidgetEnumItemExtradataParameter.USABLE_PRODUCT) && isValidController)) setCanUse(true);

        if(furniData.extraParam)
        {
            if(furniData.extraParam === RoomWidgetEnumItemExtradataParameter.CRACKABLE_FURNI)
            {
                const stuffData = (furniData.stuffData as CrackableDataType);

                setCanUse(true);
                setIsCrackable(true);
                setCrackableHits(stuffData.hits);
                setCrackableTarget(stuffData.target);
            }

            if(godMode)
            {
                const extraParam = furniData.extraParam.substr(RoomWidgetEnumItemExtradataParameter.BRANDING_OPTIONS.length);

                if(extraParam)
                {
                    const parts = extraParam.split('\t');

                    let keys: string[] = [];
                    let values: string[] = [];

                    for(const part of parts)
                    {
                        const value = part.split('=');

                        if(value && (value.length === 2))
                        {
                            keys.push(value[0]);
                            values.push(value[1]);
                        }
                    }

                    setFurniSettingsKeys(keys);
                    setFurniSettingsValues(values);
                }
            }
        }

        setPickupMode(PICKUP_MODE_NONE);

        if(furniData.isOwner || furniData.isAnyRoomController)
        {
            setPickupMode(PICKUP_MODE_FULL);
        }

        else if(furniData.isRoomOwner || (furniData.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN))
        {
            setPickupMode(PICKUP_MODE_EJECT);
        }

        else if(furniData.isStickie) setPickupMode(PICKUP_MODE_NONE);
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
                messageType = FurniAction.MOVE;
                break;
            case 'rotate':
                messageType = FurniAction.ROTATE;
                break;
            case 'pickup':
                if(pickupMode === PICKUP_MODE_FULL) messageType = FurniAction.PICKUP;
                else messageType = FurniAction.EJECT;
                break;
            case 'use':
                messageType = FurniAction.USE;
                break;
            case 'save_branding_configuration':
                messageType = FurniAction.SAVE_STUFF_DATA;
                objectData = getFurniSettingsAsString();
                break;
        }

        if(!messageType) return;

        ProcessFurniAction(messageType, furniData.id, furniData.category, furniData.purchaseOfferId, objectData);
    }, [ furniData, pickupMode ]);

    if(!furniData) return null;

    return (
        <>
            <div className="d-flex flex-column bg-dark nitro-card nitro-infostand rounded">
                <div className="container-fluid content-area">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>{ furniData.name }</div>
                        <i className="fas fa-times cursor-pointer" onClick={ close }></i>
                    </div>
                    <hr className="m-0 my-1"/>
                    <div className="w-100">
                        { furniData.stuffData.isUnique &&
                            <LimitedEditionCompactPlateView uniqueNumber={ furniData.stuffData.uniqueNumber } uniqueSeries={ furniData.stuffData.uniqueSeries } /> }
                        { furniData.image.src.length && 
                            <img className="d-block mx-auto" src={ furniData.image.src } alt="" /> }
                    </div>
                    <hr className="m-0 my-1"/>
                    <div className="d-flex flex-column">
                        <div className="small text-center text-wrap">{furniData.description}</div>
                        <hr className="m-0 my-1"/>
                        <div className="small text-center text-wrap">{ LocalizeText('furni.owner', [ 'name' ], [ furniData.ownerName ]) }</div>
                        {isCrackable && <div>
                            <hr className="m-0 my-1"/>
                            <p className="badge badge-secondary mb-0 text-wrap">{LocalizeText('infostand.crackable_furni.hits_remaining', ['hits', 'target'], [crackableHits.toString(), crackableTarget.toString()])}</p>
                            </div>}
                        { (furniData.groupId > 0) &&
                            <div className="badge badge-secondary mb-0" onClick={ openFurniGroupInfo }>
                                <BadgeImageView badgeCode={ (furniData.stuffData as StringDataType).getValue(2) } />
                            </div> }
                    </div>
                    { godMode && <>
                        <hr className="m-0 my-1"/>
                        <div className="small text-center text-wrap">ID: { furniData.id }</div>
                        {furniSettingsKeys.length > 0 && <>
                            <hr className="m-0 my-1"/>
                            { furniSettingsKeys.map((key, index) =>
                            {
                                return <div key={ index } className="mb-1">
                                            <div>{ key }</div>
                                            <input type="text" className="form-control form-control-sm" value={ furniSettingsValues[index] } onChange={ (event) => onFurniSettingChange(index, event.target.value) }/>
                                        </div>;
                            }) }
                        </> }
                    </> }
                </div>
            </div>
            <div className="button-container mt-2">
                { canMove &&
                    <button type="button" className="btn btn-sm btn-secondary" onClick={event => processButtonAction('move')}>
                        <i className="fas fa-arrows-alt me-1"></i>
                        {LocalizeText('infostand.button.move')}
                    </button>}
                { canRotate &&
                    <button type="button" className="btn btn-sm btn-secondary ms-1" onClick={event => processButtonAction('rotate')}>
                        <i className="fas fa-sync-alt me-1"></i>
                        {LocalizeText('infostand.button.rotate')}
                    </button>}
                { canUse &&
                    <button type="button" className="btn btn-sm btn-success ms-1" onClick={event => processButtonAction('use')}>
                        <i className="fas fa-mouse me-1"></i>
                        {LocalizeText('infostand.button.use')}
                    </button>}
                { (pickupMode !== PICKUP_MODE_NONE) &&
                    <button type="button" className="btn btn-sm btn-danger ms-1" onClick={event => processButtonAction('pickup')}>
                        <i className={"me-1 " + (pickupMode === PICKUP_MODE_EJECT ? "fas fa-eject" : "fas fa-box-open")}></i>
                        {LocalizeText((pickupMode === PICKUP_MODE_EJECT) ? 'infostand.button.eject' : 'infostand.button.pickup')}
                    </button>}
                { ((furniSettingsKeys.length > 0 && furniSettingsValues.length > 0) && (furniSettingsKeys.length === furniSettingsValues.length)) &&
                    <button className="btn btn-sm btn-success ms-1" onClick={ () => processButtonAction('save_branding_configuration')}>
                        <i className="fas fa-save me-1"></i>
                        { LocalizeText('save') }
                    </button> }
            </div>
        </>
    );
}
