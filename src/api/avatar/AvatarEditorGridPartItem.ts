import { AvatarFigurePartType, GetAvatarRenderManager, IAvatarImageListener, IAvatarRenderManager, IFigurePart, IFigurePartSet, IGraphicAsset, IPartColor, NitroAlphaFilter, NitroContainer, NitroSprite, TextureUtils } from '@nitrots/nitro-renderer';
import { FigureData } from './FigureData';

export class AvatarEditorGridPartItem implements IAvatarImageListener
{
    private static ALPHA_FILTER: NitroAlphaFilter = new NitroAlphaFilter({ alpha: 0.2 });
    private static THUMB_DIRECTIONS: number[] = [ 2, 6, 0, 4, 3, 1 ];
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

    private _renderManager: IAvatarRenderManager;
    private _partSet: IFigurePartSet;
    private _partColors: IPartColor[];
    private _useColors: boolean;
    private _isDisabled: boolean;
    private _thumbContainer: NitroContainer;
    private _imageUrl: string;
    private _maxColorIndex: number;
    private _isValidFigure: boolean;
    private _isHC: boolean;
    private _isSellable: boolean;
    private _isClear: boolean;
    private _isSelected: boolean;
    private _disposed: boolean;
    private _isInitalized: boolean;
    private _notifier: () => void;

    constructor(partSet: IFigurePartSet, partColors: IPartColor[], useColors: boolean = true, isDisabled: boolean = false)
    {
        this._renderManager = GetAvatarRenderManager();
        this._partSet = partSet;
        this._partColors = partColors;
        this._useColors = useColors;
        this._isDisabled = isDisabled;
        this._thumbContainer = null;
        this._imageUrl = null;
        this._maxColorIndex = 0;
        this._isValidFigure = false;
        this._isHC = false;
        this._isSellable = false;
        this._isClear = false;
        this._isSelected = false;
        this._disposed = false;
        this._isInitalized = false;

        if(partSet)
        {
            const colors = partSet.parts;

            for(const color of colors) this._maxColorIndex = Math.max(this._maxColorIndex, color.colorLayerIndex);
        }
    }

    public init(): void
    {
        if(this._isInitalized) return;

        this._isInitalized = true;

        this.update();
    }

    public dispose(): void
    {
        if(this._disposed) return;

        this._renderManager = null;
        this._partSet = null;
        this._partColors = null;
        this._imageUrl = null;
        this._disposed = true;
        this._isInitalized = false;

        if(this._thumbContainer)
        {
            this._thumbContainer.destroy();

            this._thumbContainer = null;
        }
    }

    public update(): void
    {
        this.updateThumbVisualization();
    }

    private analyzeFigure(): boolean
    {
        if(!this._renderManager || !this._partSet || !this._partSet.parts || !this._partSet.parts.length) return false;

        const figureContainer = this._renderManager.createFigureContainer(((this.partSet.type + '-') + this.partSet.id));

        if(!this._renderManager.isFigureContainerReady(figureContainer))
        {
            this._renderManager.downloadAvatarFigure(figureContainer, this);

            return false;
        }

        this._isValidFigure = true;

        return true;
    }

    private renderThumb(): NitroContainer
    {
        if(!this._renderManager || !this._partSet) return null;

        if(!this._isValidFigure)
        {
            if(!this.analyzeFigure()) return null;
        }

        const parts = this._partSet.parts.concat().sort(this.sortByDrawOrder);
        const container = new NitroContainer();

        for(const part of parts)
        {
            if(!part) continue;

            let asset: IGraphicAsset = null;
            let direction = 0;
            let hasAsset = false;

            while(!hasAsset && (direction < AvatarEditorGridPartItem.THUMB_DIRECTIONS.length))
            {
                const assetName = ((((((((((FigureData.SCALE + '_') + FigureData.STD) + '_') + part.type) + '_') + part.id) + '_') + AvatarEditorGridPartItem.THUMB_DIRECTIONS[direction]) + '_') + FigureData.DEFAULT_FRAME);

                asset = this._renderManager.getAssetByName(assetName);

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

            if(this._useColors && (part.colorLayerIndex > 0))
            {
                const color = this._partColors[(part.colorLayerIndex - 1)];

                if(color) partColor = color;
            }

            const sprite = new NitroSprite(asset.texture);

            sprite.position.set(x, y);

            if(partColor) sprite.tint = partColor.rgb;

            container.addChild(sprite);
        }

        return container;
    }

    private async updateThumbVisualization(): Promise<void>
    {
        if(!this._isInitalized) return;

        let container = this._thumbContainer;

        if(!container) container = this.renderThumb();

        if(!container) return;

        if(this._partSet)
        {
            this._isHC = (this._partSet.clubLevel > 0);
            this._isSellable = this._partSet.isSellable;
        }
        else
        {
            this._isHC = false;
            this._isSellable = false;
        }

        if(this._isDisabled) this.setAlpha(container, 0.2);

        this._imageUrl = await TextureUtils.generateImageUrl(container);
        
        if(this.notify) this.notify();
    }

    private setAlpha(container: NitroContainer, alpha: number): NitroContainer
    {
        container.filters = [ AvatarEditorGridPartItem.ALPHA_FILTER ];

        return container;
    }

    private sortByDrawOrder(a: IFigurePart, b: IFigurePart): number
    {
        const indexA = AvatarEditorGridPartItem.DRAW_ORDER.indexOf(a.type);
        const indexB = AvatarEditorGridPartItem.DRAW_ORDER.indexOf(b.type);

        if(indexA < indexB) return -1;

        if(indexA > indexB) return 1;

        if(a.index < b.index) return -1;

        if(a.index > b.index) return 1;

        return 0;
    }

    public resetFigure(figure: string): void
    {
        if(!this.analyzeFigure()) return;

        this.update();
    }

    public get disposed(): boolean
    {
        return this._disposed;
    }

    public get id(): number
    {
        if(!this._partSet) return -1;

        return this._partSet.id;
    }

    public get partSet(): IFigurePartSet
    {
        return this._partSet;
    }

    public set partColors(partColors: IPartColor[])
    {
        this._partColors = partColors;

        this.update();
    }

    public get isDisabled(): boolean
    {
        return this._isDisabled;
    }

    public set thumbContainer(container: NitroContainer)
    {
        this._thumbContainer = container;

        this.update();
    }

    public get imageUrl(): string
    {
        return this._imageUrl;
    }

    public get maxColorIndex(): number
    {
        return this._maxColorIndex;
    }

    public get isHC(): boolean
    {
        return this._isHC;
    }

    public get isSellable(): boolean
    {
        return this._isSellable;
    }

    public get isClear(): boolean
    {
        return this._isClear;
    }

    public set isClear(flag: boolean)
    {
        this._isClear = flag;
    }

    public get isSelected(): boolean
    {
        return this._isSelected;
    }

    public set isSelected(flag: boolean)
    {
        this._isSelected = flag;

        if(this.notify) this.notify();
    }

    public get notify(): () => void
    {
        return this._notifier;
    }

    public set notify(notifier: () => void)
    {
        this._notifier = notifier;
    }
}
