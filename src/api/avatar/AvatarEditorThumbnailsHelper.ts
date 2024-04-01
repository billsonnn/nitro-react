import { AvatarFigurePartType, GetAssetManager, GetAvatarRenderManager, IFigurePart, IGraphicAsset, IPartColor, NitroAlphaFilter, NitroContainer, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';
import { FigureData } from './FigureData';
import { IAvatarEditorCategoryPartItem } from './IAvatarEditorCategoryPartItem';

export class AvatarEditorThumbnailsHelper
{
    private static THUMBNAIL_CACHE: Map<string, string> = new Map();
    private static THUMB_DIRECTIONS: number[] = [ 2, 6, 0, 4, 3, 1 ];
    private static ALPHA_FILTER: NitroAlphaFilter = new NitroAlphaFilter({ alpha: 0.2 });
    private static DRAW_ORDER: string[] = [
        AvatarFigurePartType.LEFT_HAND_ITEM,
        AvatarFigurePartType.LEFT_HAND,
        AvatarFigurePartType.LEFT_SLEEVE,
        AvatarFigurePartType.LEFT_COAT_SLEEVE,
        AvatarFigurePartType.BODY,
        AvatarFigurePartType.SHOES,
        AvatarFigurePartType.LEGS,
        AvatarFigurePartType.CHEST,
        AvatarFigurePartType.CHEST_ACCESSORY,
        AvatarFigurePartType.COAT_CHEST,
        AvatarFigurePartType.CHEST_PRINT,
        AvatarFigurePartType.WAIST_ACCESSORY,
        AvatarFigurePartType.RIGHT_HAND,
        AvatarFigurePartType.RIGHT_SLEEVE,
        AvatarFigurePartType.RIGHT_COAT_SLEEVE,
        AvatarFigurePartType.HEAD,
        AvatarFigurePartType.FACE,
        AvatarFigurePartType.EYES,
        AvatarFigurePartType.HAIR,
        AvatarFigurePartType.HAIR_BIG,
        AvatarFigurePartType.FACE_ACCESSORY,
        AvatarFigurePartType.EYE_ACCESSORY,
        AvatarFigurePartType.HEAD_ACCESSORY,
        AvatarFigurePartType.HEAD_ACCESSORY_EXTRA,
        AvatarFigurePartType.RIGHT_HAND_ITEM,
    ];

    private static getThumbnailKey(setType: string, part: IAvatarEditorCategoryPartItem): string
    {
        return `${ setType }-${ part.partSet.id }`;
    }

    public static async build(setType: string, part: IAvatarEditorCategoryPartItem, useColors: boolean, isDisabled: boolean = false): Promise<string>
    {
        if(!setType || !setType.length || !part || !part.partSet || !part.partSet.parts || !part.partSet.parts.length) return null;

        const thumbnailKey = this.getThumbnailKey(setType, part);
        const cached = this.THUMBNAIL_CACHE.get(thumbnailKey);

        if(cached) return cached;

        const buildContainer = (part: IAvatarEditorCategoryPartItem, useColors: boolean, isDisabled: boolean = false) =>
        {
            const container = new NitroContainer();
            const parts = part.partSet.parts.concat().sort(this.sortByDrawOrder);

            for(const part of parts)
            {
                if(!part) continue;

                let asset: IGraphicAsset = null;
                let direction = 0;
                let hasAsset = false;

                while(!hasAsset && (direction < AvatarEditorThumbnailsHelper.THUMB_DIRECTIONS.length))
                {
                    const assetName = `${ FigureData.SCALE }_${ FigureData.STD }_${ part.type }_${ part.id }_${ AvatarEditorThumbnailsHelper.THUMB_DIRECTIONS[direction] }_${ FigureData.DEFAULT_FRAME }`;

                    asset = GetAssetManager().getAsset(assetName);

                    if(asset && asset.texture)
                    {
                        hasAsset = true;
                    }
                    else
                    {
                        direction++;
                    }
                }

                if(!hasAsset) continue;

                const x = asset.offsetX;
                const y = asset.offsetY;
                let partColor: IPartColor = null;

                if(useColors && (part.colorLayerIndex > 0))
                {
                    //const color = this._partColors[(part.colorLayerIndex - 1)];

                    //if(color) partColor = color;
                }

                const sprite = new NitroSprite(asset.texture);

                sprite.position.set(x, y);

                if(partColor) sprite.tint = partColor.rgb;

                if(isDisabled) container.filters = [ AvatarEditorThumbnailsHelper.ALPHA_FILTER ];

                container.addChild(sprite);
            }

            return container;
        }

        return new Promise(async (resolve, reject) =>
        {
            const resetFigure = async (figure: string) =>
            {
                const container = buildContainer(part, useColors, isDisabled);
                const url = await TextureUtils.generateImageUrl(container);

                AvatarEditorThumbnailsHelper.THUMBNAIL_CACHE.set(thumbnailKey, url);

                resolve(url);
            }

            const figureContainer = GetAvatarRenderManager().createFigureContainer(`${ setType }-${ part.partSet.id }`);

            if(!GetAvatarRenderManager().isFigureContainerReady(figureContainer))
            {
                GetAvatarRenderManager().downloadAvatarFigure(figureContainer, {
                    resetFigure,
                    dispose: null,
                    disposed: false
                });
            }
            else
            {
                resetFigure(null);
            }
        });
    }

    private static sortByDrawOrder(a: IFigurePart, b: IFigurePart): number
    {
        const indexA = AvatarEditorThumbnailsHelper.DRAW_ORDER.indexOf(a.type);
        const indexB = AvatarEditorThumbnailsHelper.DRAW_ORDER.indexOf(b.type);

        if(indexA < indexB) return -1;

        if(indexA > indexB) return 1;

        if(a.index < b.index) return -1;

        if(a.index > b.index) return 1;

        return 0;
    }
}
