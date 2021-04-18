import { RoomWidgetUpdateEvent } from 'nitro-renderer';

export class RoomWidgetPetFigureUpdateEvent extends RoomWidgetUpdateEvent
{
    public static PET_FIGURE_UPDATE: string = 'RWPIUE_PET_FIGURE_UPDATE';

    private _petId: number;
    private _image: HTMLImageElement;

    constructor(petId: number, image: HTMLImageElement)
    {
        super(RoomWidgetPetFigureUpdateEvent.PET_FIGURE_UPDATE);

        this._petId = petId;
        this._image = image;
    }

    public get petId(): number
    {
        return this._petId;
    }

    public get image(): HTMLImageElement
    {
        return this._image;
    }
}
