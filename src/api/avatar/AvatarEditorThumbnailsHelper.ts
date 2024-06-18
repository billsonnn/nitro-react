import { AvatarFigurePartType, AvatarScaleType, AvatarSetType, GetAssetManager, GetAvatarRenderManager, IFigurePart, IGraphicAsset, IPartColor, NitroAlphaFilter, NitroContainer, NitroRectangle, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';
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

    public static clearCache(): void
    {
        this.THUMBNAIL_CACHE.clear();
    }

    public static async build(setType: string, part: IAvatarEditorCategoryPartItem, useColors: boolean, partColors: IPartColor[], isDisabled: boolean = false): Promise<string>
    {
        if(!setType || !setType.length || !part || !part.partSet || !part.partSet.parts || !part.partSet.parts.length) return null;

        const thumbnailKey = this.getThumbnailKey(setType, part);
        const cached = this.THUMBNAIL_CACHE.get(thumbnailKey);

        if(cached) return cached;

        const buildContainer = (part: IAvatarEditorCategoryPartItem, useColors: boolean, partColors: IPartColor[], isDisabled: boolean = false) =>
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
                    const assetName = `${ AvatarFigurePartType.SCALE }_${ AvatarFigurePartType.STD }_${ part.type }_${ part.id }_${ AvatarEditorThumbnailsHelper.THUMB_DIRECTIONS[direction] }_${ AvatarFigurePartType.DEFAULT_FRAME }`;

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

                if(!hasAsset)
                {
                    console.log(`${ AvatarFigurePartType.SCALE }_${ AvatarFigurePartType.STD }_${ part.type }_${ part.id }`);
                    continue;
                }

                const x = asset.offsetX;
                const y = asset.offsetY;

                const sprite = new NitroSprite(asset.texture);

                sprite.position.set(x, y);

                if(useColors && (part.colorLayerIndex > 0) && partColors && partColors.length)
                {
                    const color = partColors[(part.colorLayerIndex - 1)];

                    if(color) sprite.tint = color.rgb;
                }

                if(isDisabled) container.filters = [ AvatarEditorThumbnailsHelper.ALPHA_FILTER ];

                container.addChild(sprite);
            }

            return container;
        };

        return new Promise(async (resolve, reject) =>
        {
            const resetFigure = async (figure: string) =>
            {
                const container = buildContainer(part, useColors, partColors, isDisabled);
                const imageUrl = await TextureUtils.generateImageUrl(container);

                AvatarEditorThumbnailsHelper.THUMBNAIL_CACHE.set(thumbnailKey, imageUrl);

                resolve(imageUrl);
            };

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

    public static async buildForFace(figureString: string, isDisabled: boolean = false): Promise<string>
    {
        if(!figureString || !figureString.length) return null;

        const thumbnailKey = figureString;
        const cached = this.THUMBNAIL_CACHE.get(thumbnailKey);

        if(cached) return cached;

        return new Promise(async (resolve, reject) =>
        {
            const resetFigure = async (figure: string) =>
            {
                const avatarImage = GetAvatarRenderManager().createAvatarImage(figure, AvatarScaleType.LARGE, null, { resetFigure, dispose: null, disposed: false });

                if(avatarImage.isPlaceholder()) return;

                const texture = avatarImage.processAsTexture(AvatarSetType.HEAD, false);
                const sprite = new NitroSprite(texture);

                if(isDisabled) sprite.filters = [ AvatarEditorThumbnailsHelper.ALPHA_FILTER ];

                const imageUrl = await TextureUtils.generateImageUrl({
                    target: sprite,
                    frame: new NitroRectangle(0, 0, texture.width, texture.height)
                });

                sprite.destroy();
                avatarImage.dispose();

                AvatarEditorThumbnailsHelper.THUMBNAIL_CACHE.set(thumbnailKey, imageUrl);

                resolve(imageUrl);
            };

            resetFigure(figureString);
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
