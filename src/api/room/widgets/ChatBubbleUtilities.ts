import { AvatarFigurePartType, AvatarScaleType, AvatarSetType, GetAvatarRenderManager, GetRoomEngine, PetFigureData, TextureUtils, Vector3d } from '@nitrots/nitro-renderer';

export class ChatBubbleUtilities
{
    public static AVATAR_COLOR_CACHE: Map<string, number> = new Map();
    public static AVATAR_IMAGE_CACHE: Map<string, string> = new Map();
    public static PET_IMAGE_CACHE: Map<string, string> = new Map();

    private static placeHolderImageUrl: string = '';

    public static async setFigureImage(figure: string): Promise<string>
    {
        const avatarImage = GetAvatarRenderManager().createAvatarImage(figure, AvatarScaleType.LARGE, null, {
            resetFigure: figure => this.setFigureImage(figure),
            dispose: () => 
            {},
            disposed: false
        });

        if(!avatarImage) return null;

        const isPlaceholder = avatarImage.isPlaceholder();

        if(isPlaceholder && this.placeHolderImageUrl?.length) return this.placeHolderImageUrl;

        figure = avatarImage.getFigure().getFigureString();

        const imageUrl = avatarImage.processAsImageUrl(AvatarSetType.HEAD);
        const color = avatarImage.getPartColor(AvatarFigurePartType.CHEST);

        if(isPlaceholder) this.placeHolderImageUrl = imageUrl;

        this.AVATAR_COLOR_CACHE.set(figure, ((color && color.rgb) || 16777215));
        this.AVATAR_IMAGE_CACHE.set(figure, imageUrl);

        avatarImage.dispose();

        return imageUrl;
    }

    public static async getUserImage(figure: string): Promise<string>
    {
        let existing = this.AVATAR_IMAGE_CACHE.get(figure);

        if(!existing) existing = await this.setFigureImage(figure);

        return existing;
    }

    public static async getPetImage(figure: string, direction: number, _arg_3: boolean, scale: number = 64, posture: string = null)
    {
        let existing = this.PET_IMAGE_CACHE.get((figure + posture));

        if(existing) return existing;

        const figureData = new PetFigureData(figure);
        const typeId = figureData.typeId;
        const image = GetRoomEngine().getRoomObjectPetImage(typeId, figureData.paletteId, figureData.color, new Vector3d((direction * 45)), scale, null, false, 0, figureData.customParts, posture);

        if(image)
        {
            existing = await TextureUtils.generateImageUrl(image.data);

            this.PET_IMAGE_CACHE.set((figure + posture), existing);
        }

        return existing;
    }
}
