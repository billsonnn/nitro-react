import { CatalogPageComposer } from 'nitro-renderer';

export function GetCatalogPageComposer(...args: ConstructorParameters<typeof CatalogPageComposer>): CatalogPageComposer
{
    return new CatalogPageComposer(...args);
}
