import { GetConfigurationValue } from '../nitro';
import { IPageLocalization } from './IPageLocalization';

export class PageLocalization implements IPageLocalization
{
    private _images: string[];
    private _texts: string[]

    constructor(images: string[], texts: string[])
    {
        this._images = images;
        this._texts = texts;
    }

    public getText(index: number): string
    {
        let message = (this._texts[index] || '');

        if(message && message.length) message = message.replace(/\r\n|\r|\n/g, '<br />');

        return message;
    }

    public getImage(index: number): string
    {
        const imageName = (this._images[index] || '');

        if(!imageName || !imageName.length) return null;

        let assetUrl = GetConfigurationValue<string>('catalog.asset.image.url');

        assetUrl = assetUrl.replace('%name%', imageName);

        return assetUrl;
    }
}
