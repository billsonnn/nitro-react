import { SellablePetPaletteData } from '@nitrots/nitro-renderer';

export class CatalogPetPalette
{
    constructor(
        public readonly breed: string,
        public readonly palettes: SellablePetPaletteData[]
    )
    {}
}
