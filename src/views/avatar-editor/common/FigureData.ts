export class FigureData
{
    public static MALE: string = 'M';
    public static FEMALE: string = 'F';
    public static UNISEX: string = 'U';
    public static SCALE: string = 'h';
    public static STD: string = 'std';
    public static DEFAULT_FRAME: string = '0';
    public static FACE: string = 'hd';
    public static HAIR: string = 'hr';
    public static HAT: string = 'ha';
    public static HEAD_ACCESSORIES: string = 'he';
    public static EYE_ACCESSORIES: string = 'ea';
    public static FACE_ACCESSORIES: string = 'fa';
    public static JACKET: string = 'cc';
    public static SHIRT: string = 'ch';
    public static CHEST_ACCESSORIES: string = 'ca';
    public static CHEST_PRINTS: string = 'cp';
    public static TROUSERS: string = 'lg';
    public static SHOES: string = 'sh';
    public static TROUSER_ACCESSORIES: string = 'wa';
    public static PREVIEW_AVATAR_DIRECTION: number = 4;

    private _data: Map<string, number>;
    private _colors: Map<string, number[]>;
    private _gender: string = 'M';
    private _avatarEffectType: number = -1;
    private _notifier: () => void = null;

    public loadAvatarData(figureString: string, gender: string): void
    {
        this._data = new Map();
        this._colors = new Map();
        this._gender = gender;

        this.parseFigureString(figureString);
        this.updateView();
    }

    private parseFigureString(figure: string): void
    {
        if(!figure) return;

        const sets = figure.split('.');

        if(!sets || !sets.length) return;

        for(const set of sets)
        {
            const parts = set.split('-');

            if(!parts.length) continue;

            const setType = parts[0];
            const setId = parseInt(parts[1]);
            const colorIds: number[] = [];

            let offset = 2;

            while(offset < parts.length)
            {
                colorIds.push(parseInt(parts[offset]));

                offset++;
            }

            if(!colorIds.length) colorIds.push(0);

            this.savePartSetId(setType, setId, false);
            this.savePartSetColourId(setType, colorIds, false);
        }
    }

    public getPartSetId(partSetId: string): number
    {
        const existing = this._data.get(partSetId);

        if(existing !== undefined) return existing;

        return -1;
    }

    public getColourIds(colorId: string): number[]
    {
        const existing = this._colors.get(colorId);

        if(existing !== undefined) return existing;

        return [];
        // return [this._avatarEditor._Str_24919(k)];
    }

    public getFigureString(): string
    {
        let figureString = '';
        const setParts: string[] = [];

        for(const [ setType, setId ] of this._data.entries())
        {
            const colorIds = this._colors.get(setType);

            let setPart = ((setType + '-') + setId);

            if(colorIds && colorIds.length)
            {
                let i = 0;

                while(i < colorIds.length)
                {
                    setPart = (setPart + ('-' + colorIds[i]));

                    i++;
                }
            }

            setParts.push(setPart);
        }

        let i = 0;

        while(i < setParts.length)
        {
            figureString = (figureString + setParts[i]);

            if(i < (setParts.length - 1)) figureString = (figureString + '.');

            i++;
        }

        return figureString;
    }

    public savePartData(k: string, _arg_2: number, _arg_3: number[], _arg_4: boolean = false): void
    {
        this.savePartSetId(k, _arg_2, _arg_4);
        this.savePartSetColourId(k, _arg_3, _arg_4);
    }

    private savePartSetId(k: string, _arg_2: number, _arg_3: boolean = true): void
    {
        switch(k)
        {
            case FigureData.FACE:
            case FigureData.HAIR:
            case FigureData.HAT:
            case FigureData.HEAD_ACCESSORIES:
            case FigureData.EYE_ACCESSORIES:
            case FigureData.FACE_ACCESSORIES:
            case FigureData.SHIRT:
            case FigureData.JACKET:
            case FigureData.CHEST_ACCESSORIES:
            case FigureData.CHEST_PRINTS:
            case FigureData.TROUSERS:
            case FigureData.SHOES:
            case FigureData.TROUSER_ACCESSORIES:
                if(_arg_2 >= 0)
                {
                    this._data.set(k, _arg_2);
                }
                else
                {
                    this._data.delete(k);
                }
                break;
        }

        if(_arg_3) this.updateView();
    }

    public savePartSetColourId(k: string, _arg_2: number[], _arg_3: boolean = true): void
    {
        switch(k)
        {
            case FigureData.FACE:
            case FigureData.HAIR:
            case FigureData.HAT:
            case FigureData.HEAD_ACCESSORIES:
            case FigureData.EYE_ACCESSORIES:
            case FigureData.FACE_ACCESSORIES:
            case FigureData.SHIRT:
            case FigureData.JACKET:
            case FigureData.CHEST_ACCESSORIES:
            case FigureData.CHEST_PRINTS:
            case FigureData.TROUSERS:
            case FigureData.SHOES:
            case FigureData.TROUSER_ACCESSORIES:
                this._colors.set(k, _arg_2);
                break;
        }

        if(_arg_3) this.updateView();
    }

    public getFigureStringWithFace(k: number, override = true): string
    {
        let figureString = '';

        const setTypes: string[]    = [ FigureData.FACE ];
        const figureSets: string[]  = [];

        for(const setType of setTypes)
        {
            const colors = this._colors.get(setType);

            if(colors === undefined) continue;

            let setId = this._data.get(setType);

            if((setType === FigureData.FACE) && override) setId = k;

            let figureSet = ((setType + '-') + setId);

            if(setId >= 0)
            {
                let i = 0;

                while(i < colors.length)
                {
                    figureSet = (figureSet + ('-' + colors[i]));

                    i++;
                }
            }

            figureSets.push(figureSet);
        }

        let i = 0;

        while(i < figureSets.length)
        {
            figureString = (figureString + figureSets[i]);

            if(i < (figureSets.length - 1)) figureString = (figureString + '.');

            i++;
        }

        return figureString;
    }

    public updateView(): void
    {
        if(this.notify) this.notify();
    }

    public get gender(): string
    {
        return this._gender;
    }

    public set avatarEffectType(k: number)
    {
        this._avatarEffectType = k;
    }

    public get avatarEffectType(): number
    {
        return this._avatarEffectType;
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
