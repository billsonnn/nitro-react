import { RoomObjectCategory, RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetFurnitureDataForRoomObject, LocalizeText } from '../../../../../../api';
import { FurniCategory } from '../../../../../../components/inventory/common/FurniCategory';
import { useRoomContext } from '../../../../context/RoomContext';
import { ContextMenuView } from '../../../context-menu/ContextMenuView';
import { ContextMenuHeaderView } from '../../../context-menu/views/header/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../../../context-menu/views/list-item/ContextMenuListItemView';
import { AvatarInfoUseProductViewProps } from './AvatarInfoUseProductView.types';

const PRODUCT_PAGE_UKNOWN: number = 0;
const PRODUCT_PAGE_SHAMPOO: number = 1;
const PRODUCT_PAGE_CUSTOM_PART: number = 2;
const PRODUCT_PAGE_CUSTOM_PART_SHAMPOO: number = 3;
const PRODUCT_PAGE_SADDLE: number = 4;
const PRODUCT_PAGE_REVIVE: number = 5;
const PRODUCT_PAGE_REBREED: number = 6;
const PRODUCT_PAGE_FERTILIZE: number = 7;

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

        let mode = PRODUCT_PAGE_UKNOWN;

        switch(furniData.specialType)
        {
            case FurniCategory.PET_SHAMPOO:
                mode = PRODUCT_PAGE_SHAMPOO;
                break;
            case FurniCategory.PET_CUSTOM_PART:
                mode = PRODUCT_PAGE_CUSTOM_PART;
                break;
            case FurniCategory.PET_CUSTOM_PART_SHAMPOO:
                mode = PRODUCT_PAGE_CUSTOM_PART_SHAMPOO;
                break;
            case FurniCategory.PET_SADDLE:
                mode = PRODUCT_PAGE_SADDLE;
                break;
            case FurniCategory.MONSTERPLANT_REVIVAL:
                mode = PRODUCT_PAGE_REVIVE;
                break;
            case FurniCategory.MONSTERPLANT_REBREED:
                mode = PRODUCT_PAGE_REBREED;
                break;
            case FurniCategory.MONSTERPLANT_FERTILIZE:
                mode = PRODUCT_PAGE_FERTILIZE;
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
            { (mode === PRODUCT_PAGE_UKNOWN) &&
                <ContextMenuListItemView onClick={ event => processAction('use_product') }>
                    { LocalizeText('infostand.button.useproduct') }
                </ContextMenuListItemView> }
            { (mode === PRODUCT_PAGE_SHAMPOO) &&
                <ContextMenuListItemView onClick={ event => processAction('use_product_shampoo') }>
                    { LocalizeText('infostand.button.useproduct_shampoo') }
                </ContextMenuListItemView> }
            { (mode === PRODUCT_PAGE_CUSTOM_PART) &&
                <ContextMenuListItemView onClick={ event => processAction('use_product_custom_part') }>
                    { LocalizeText('infostand.button.useproduct_custom_part') }
                </ContextMenuListItemView> }
            { (mode === PRODUCT_PAGE_CUSTOM_PART_SHAMPOO) &&
                <ContextMenuListItemView onClick={ event => processAction('use_product_custom_part_shampoo') }>
                    { LocalizeText('infostand.button.useproduct_custom_part_shampoo') }
                </ContextMenuListItemView> }
            { (mode === PRODUCT_PAGE_SADDLE) &&
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
            { (mode === PRODUCT_PAGE_REVIVE) &&
                <ContextMenuListItemView onClick={ event => processAction('revive_monsterplant') }>
                    { LocalizeText('infostand.button.revive_monsterplant') }
                </ContextMenuListItemView> }
            { (mode === PRODUCT_PAGE_REBREED) &&
                <ContextMenuListItemView onClick={ event => processAction('rebreed_monsterplant') }>
                    { LocalizeText('infostand.button.rebreed_monsterplant') }
                </ContextMenuListItemView> }
            { (mode === PRODUCT_PAGE_FERTILIZE) &&
                <ContextMenuListItemView onClick={ event => processAction('fertilize_monsterplant') }>
                    { LocalizeText('infostand.button.fertilize_monsterplant') }
                </ContextMenuListItemView> }
        </ContextMenuView>
    );
}
