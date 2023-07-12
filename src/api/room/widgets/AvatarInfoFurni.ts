import { IObjectData } from '@nitrots/nitro-renderer';
import { IAvatarInfo } from './IAvatarInfo';

export class AvatarInfoFurni implements IAvatarInfo
{
    public static FURNI: string = 'IFI_FURNI';

    public id: number = 0;
    public category: number = 0;
    public name: string = '';
    public description: string = '';
    public isWallItem: boolean = false;
    public isStickie: boolean = false;
    public isRoomOwner: boolean = false;
    public roomControllerLevel: number = 0;
    public isAnyRoomController: boolean = false;
    public expiration: number = -1;
    public purchaseCatalogPageId: number = -1;
    public purchaseOfferId: number = -1;
    public extraParam: string = '';
    public isOwner: boolean = false;
    public stuffData: IObjectData = null;
    public groupId: number = 0;
    public ownerId: number = 0;
    public ownerName: string = '';
    public usagePolicy: number = 0;
    public rentCatalogPageId: number = -1;
    public rentOfferId: number = -1;
    public purchaseCouldBeUsedForBuyout: boolean = false;
    public rentCouldBeUsedForBuyout: boolean = false;
    public availableForBuildersClub: boolean = false;
    public tileSizeX: number = 1;
    public tileSizeY: number = 1;

    constructor(public readonly type: string)
    {}
}
