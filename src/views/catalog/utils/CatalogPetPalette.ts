import { SellablePetPaletteData } from 'nitro-renderer';

export class CatalogPetPalette
{
    constructor(
        public breed: string,
        public palettes: SellablePetPaletteData[]
    ) {}
}
