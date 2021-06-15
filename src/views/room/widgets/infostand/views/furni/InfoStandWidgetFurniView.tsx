import { CrackableDataType, RoomControllerLevel, RoomWidgetEnumItemExtradataParameter, RoomWidgetFurniInfoUsagePolicyEnum, StringDataType } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { FurniAction, ProcessFurniAction } from '../../../../../../api';
import { NitroCardContentView, NitroCardView } from '../../../../../../layout';
import { NitroCardSimpleHeaderView } from '../../../../../../layout/card/simple-header';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { BadgeImageView } from '../../../../../badge-image/BadgeImageView';
import { LimitedEditionCompactPlateView } from '../../../../../limited-edition/compact-plate/LimitedEditionCompactPlateView';
import { InfoStandWidgetFurniViewProps } from './InfoStandWidgetFurniView.types';

const PICKUP_MODE_NONE: number = 0;
const PICKUP_MODE_EJECT: number = 1;
const PICKUP_MODE_FULL: number = 2;

export const InfoStandWidgetFurniView: FC<InfoStandWidgetFurniViewProps> = props =>
{
    const { furnitureInfoData = null, close = null } = props;
    const [ pickupMode, setPickupMode ] = useState(0);
    const [ canMove, setCanMove ] = useState(false);
    const [ canRotate, setCanRotate ] = useState(false);
    const [ canUse, setCanUse ] = useState(false);
    const [ furniSettingsKeys, setFurniSettingsKeys ] = useState<string[]>([]);
    const [ furniSettingsValues, setFurniSettingsValues ] = useState<string[]>([]);
    const [ isCrackable, setIsCrackable ] = useState(false);
    const [ crackableHits, setCrackableHits ] = useState(0);
    const [ crackableTarget, setCrackableTarget ] = useState(0);

    useEffect(() =>
    {
        const isValidController = (furnitureInfoData.roomControllerLevel >= RoomControllerLevel.GUEST);

        let godMode = false;

        if(isValidController || furnitureInfoData.isOwner || furnitureInfoData.isRoomOwner || furnitureInfoData.isAnyRoomController)
        {
            setCanMove(true);
            setCanRotate(!furnitureInfoData.isWallItem);

            if(furnitureInfoData.roomControllerLevel >= RoomControllerLevel.MODERATOR) godMode = true;
        }

        if((((furnitureInfoData.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum._Str_18353) || ((furnitureInfoData.usagePolicy === RoomWidgetFurniInfoUsagePolicyEnum._Str_18194) && isValidController)) || ((furnitureInfoData.extraParam === RoomWidgetEnumItemExtradataParameter.JUKEBOX) && isValidController)) || ((furnitureInfoData.extraParam === RoomWidgetEnumItemExtradataParameter.USABLE_PRODUCT) && isValidController)) setCanUse(true);

        if(furnitureInfoData.extraParam)
        {
            if(furnitureInfoData.extraParam === RoomWidgetEnumItemExtradataParameter.CRACKABLE_FURNI)
            {
                const stuffData = (furnitureInfoData.stuffData as CrackableDataType);

                setCanUse(true);
                setIsCrackable(true);
                setCrackableHits(stuffData.hits);
                setCrackableTarget(stuffData.target);
            }

            if(godMode)
            {
                const extraParam = furnitureInfoData.extraParam.substr(RoomWidgetEnumItemExtradataParameter.BRANDING_OPTIONS.length);

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

        if(furnitureInfoData.isOwner || furnitureInfoData.isAnyRoomController)
        {
            setPickupMode(PICKUP_MODE_FULL);
        }

        else if(furnitureInfoData.isRoomOwner || (furnitureInfoData.roomControllerLevel >= RoomControllerLevel.GUILD_ADMIN))
        {
            setPickupMode(PICKUP_MODE_EJECT);
        }

        else if(furnitureInfoData.isStickie) setPickupMode(PICKUP_MODE_NONE);
    }, [ furnitureInfoData ]);

    const openFurniGroupInfo = useCallback(() =>
    {

    }, []);

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
            // case 'save_branding_configuration':
            //     messageType = RoomWidgetFurniActionMessage.RWFAM_SAVE_STUFF_DATA;
            //     objectData = this.getSettingsAsString();
            //     break;
        }

        if(!messageType) return;

        ProcessFurniAction(messageType, furnitureInfoData.id, furnitureInfoData.category, furnitureInfoData.purchaseOfferId, objectData);
    }, [ furnitureInfoData, pickupMode ]);

    if(!furnitureInfoData) return null;

    return (
        <>
            <NitroCardView className="nitro-infostand" simple={ true }>
                <NitroCardSimpleHeaderView headerText={ furnitureInfoData.name } onCloseClick={ close } />
                <NitroCardContentView>
                    <div className="w-100">
                        { furnitureInfoData.stuffData.isUnique &&
                            <LimitedEditionCompactPlateView uniqueNumber={ furnitureInfoData.stuffData.uniqueNumber } uniqueSeries={ furnitureInfoData.stuffData.uniqueSeries } /> }
                        { furnitureInfoData.image.src.length && 
                            <img className="d-block mx-auto" src={ furnitureInfoData.image.src } alt="" /> }
                    </div>
                    <div className="d-flex flex-column mt-2">
                        <p className="badge badge-secondary mb-0 text-wrap">{ furnitureInfoData.description }</p>
                        <p className="badge badge-secondary mt-2 mb-0 text-wrap">{ LocalizeText('furni.owner', [ 'name' ], [ furnitureInfoData.ownerName ]) }</p>
                        { isCrackable &&
                            <p className="badge badge-secondary mt-2 mb-0 text-wrap">{ LocalizeText('infostand.crackable_furni.hits_remaining', ['hits', 'target'], [ crackableHits.toString(), crackableTarget.toString() ]) }</p> }
                        { (furnitureInfoData.groupId > 0) &&
                            <div className="badge badge-secondary mt-2 mb-0" onClick={ openFurniGroupInfo }>
                                <BadgeImageView badgeCode={ (furnitureInfoData.stuffData as StringDataType).getValue(2) } />
                            </div> }
                    </div>
                    {/* <div className="mt-3" *ngIf="((furniSettingsKeys.length && furniSettingsValues.length) && (furniSettingsKeys.length === furniSettingsValues.length))">
                        <ng-container *ngFor="let setting of furniSettingsKeys; let i = index">
                            <p className="badge badge-secondary mb-2">{{ furniSettingsKeys[i] }}</p>
                            <input type="text" className="form-control rounded mb-2" [(ngModel)]="furniSettingsValues[i]">
                        </ng-container>
                    </div> */}
                </NitroCardContentView>
            </NitroCardView>
            <div className="button-container btn-group mt-2">
                { canMove &&
                    <button type="button" className="btn btn-dark" onClick={ event => processButtonAction('move') }>{ LocalizeText('infostand.button.move') }</button> }
                { canRotate &&
                    <button type="button" className="btn btn-dark" onClick={ event => processButtonAction('rotate') }>{ LocalizeText('infostand.button.rotate') }</button> }
                { (pickupMode !== PICKUP_MODE_NONE) &&
                    <button type="button" className="btn btn-dark" onClick={ event => processButtonAction('pickup') }>{ LocalizeText((pickupMode === PICKUP_MODE_EJECT) ? 'infostand.button.eject' : 'infostand.button.pickup') }</button> }
                { canUse &&
                    <button type="button" className="btn btn-dark" onClick={ event => processButtonAction('use') }>{ LocalizeText('infostand.button.use') }</button> }
                {/* <button *ngIf="((furniSettingsKeys.length && furniSettingsValues.length) && (furniSettingsKeys.length === furniSettingsValues.length))" className="btn btn-primary" (click)="processButtonAction('save_branding_configuration')">{{ 'save' | translate }}</button> */}
            </div>
        </>
    );
}
