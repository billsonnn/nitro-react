import { SellablePetPaletteData } from '@nitrots/nitro-renderer';

export class CatalogPetPalette
{
    constructor(
        public breed: string,
        public palettes: SellablePetPaletteData[]
    ) {}
}
