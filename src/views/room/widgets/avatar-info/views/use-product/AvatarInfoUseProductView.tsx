import { RoomObjectCategory, RoomObjectType } from 'nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetFurnitureDataForRoomObject } from '../../../../../../api';
import { LocalizeText } from '../../../../../../utils/LocalizeText';
import { FurniCategory } from '../../../../../inventory/common/FurniCategory';
import { useRoomContext } from '../../../../context/RoomContext';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { ContextMenuHeaderView } from '../../../context-menu/views/header/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../../context-menu/views/list-item/ContextMenuListItemView';
import { AvatarInfoUseProductViewProps } from './AvatarInfoUseProductView.types';

const _Str_2906: number = 0;
const _Str_13718: number = 1;
const _Str_14146: number = 2;
const _Str_15667: number = 3;
const _Str_14658: number = 4;
const _Str_14165: number = 5;
const _Str_12577: number = 6;
const _Str_14611: number = 7;

export const AvatarInfoUseProductView: FC<AvatarInfoUseProductViewProps> = props =>
{
    const { item = null, updateConfirmingProduct = null, close = null } = props;
    const [ mode, setMode ] = useState(0);
    const { roomSession = null } = useRoomContext();

    useEffect(() =>
    {
        if(!item) return;

        const furniData = GetFurnitureDataForRoomObject(roomSession.roomId, item.requestRoomObjectId, RoomObjectCategory.FLOOR);

        if(!furniData) return;

        let mode = _Str_2906;

        switch(furniData.specialType)
        {
            case FurniCategory._Str_7696:
                mode = _Str_13718;
                break;
            case FurniCategory._Str_7297:
                mode = _Str_14146;
                break;
            case FurniCategory._Str_7954:
                mode = _Str_15667;
                break;
            case FurniCategory._Str_6096:
                mode = _Str_14658;
                break;
            case FurniCategory._Str_6915:
                mode = _Str_14165;
                break;
            case FurniCategory._Str_8726:
                mode = _Str_12577;
                break;
            case FurniCategory._Str_9449:
                mode = _Str_14611;
                break;
        }

        setMode(mode);
    }, [ roomSession, item ]);

    const processAction = useCallback((name: string) =>
    {
        if(!name) return;
        
        switch(name)
        {
            case 'use_product':
            case 'use_product_shampoo':
            case 'use_product_custom_part':
            case 'use_product_custom_part_shampoo':
            case 'use_product_saddle':
            case 'replace_product_saddle':
            case 'revive_monsterplant':
            case 'rebreed_monsterplant':
            case 'fertilize_monsterplant':
                updateConfirmingProduct(item);
                break;
        }
    }, [ item, updateConfirmingProduct ]);
    
    return (
        <ContextMenuView objectId={ item.id } category={ RoomObjectCategory.UNIT } userType={ RoomObjectType.PET } close={ close }>
            <ContextMenuHeaderView>
                { item.name }
            </ContextMenuHeaderView>
            { (mode === _Str_2906) &&
                <ContextMenuListItemView onClick={ event => processAction('use_product') }>
                    { LocalizeText('infostand.button.useproduct') }
                </ContextMenuListItemView> }
            { (mode === _Str_13718) &&
                <ContextMenuListItemView onClick={ event => processAction('use_product_shampoo') }>
                    { LocalizeText('infostand.button.useproduct_shampoo') }
                </ContextMenuListItemView> }
            { (mode === _Str_14146) &&
                <ContextMenuListItemView onClick={ event => processAction('use_product_custom_part') }>
                    { LocalizeText('infostand.button.useproduct_custom_part') }
                </ContextMenuListItemView> }
            { (mode === _Str_15667) &&
                <ContextMenuListItemView onClick={ event => processAction('use_product_custom_part_shampoo') }>
                    { LocalizeText('infostand.button.useproduct_custom_part_shampoo') }
                </ContextMenuListItemView> }
            { (mode === _Str_14658) &&
                <>
                    { item.replace &&
                        <ContextMenuListItemView onClick={ event => processAction('replace_product_saddle') }>
                            { LocalizeText('infostand.button.replaceproduct_saddle') }
                        </ContextMenuListItemView> }
                    { !item.replace &&
                        <ContextMenuListItemView onClick={ event => processAction('use_product_saddle') }>
                            { LocalizeText('infostand.button.useproduct_saddle') }
                        </ContextMenuListItemView> }
                </> }
            { (mode === _Str_14165) &&
                <ContextMenuListItemView onClick={ event => processAction('revive_monsterplant') }>
                    { LocalizeText('infostand.button.revive_monsterplant') }
                </ContextMenuListItemView> }
            { (mode === _Str_12577) &&
                <ContextMenuListItemView onClick={ event => processAction('rebreed_monsterplant') }>
                    { LocalizeText('infostand.button.rebreed_monsterplant') }
                </ContextMenuListItemView> }
            { (mode === _Str_14611) &&
                <ContextMenuListItemView onClick={ event => processAction('fertilize_monsterplant') }>
                    { LocalizeText('infostand.button.fertilize_monsterplant') }
                </ContextMenuListItemView> }
        </ContextMenuView>
    );
}
