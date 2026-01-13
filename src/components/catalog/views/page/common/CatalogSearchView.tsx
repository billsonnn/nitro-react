import { IFurnitureData } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { CatalogPage, CatalogType, FilterCatalogNode, FurnitureOffer, GetOfferNodes, GetSessionDataManager, ICatalogNode, ICatalogPage, IPurchasableOffer, LocalizeText, PageLocalization, SearchResult } from "../../../../../api"
import { useCatalog } from "../../../../../hooks"

export const CatalogSearchView: FC<{}> = props =>
{
    const [ searchValue, setSearchValue ] = useState("")
    const { currentType = null, rootNode = null, offersToNodes = null, searchResult = null, setSearchResult = null, setCurrentPage = null } = useCatalog()

    useEffect(() =>
    {
        let search = searchValue?.toLocaleLowerCase().replace(" ", "")

        if(!search || !search.length)
        {
            setSearchResult(null)

            return
        }

        const timeout = setTimeout(() =>
        {
            const furnitureDatas = GetSessionDataManager().getAllFurnitureData({
                loadFurnitureData: null
            })

            if(!furnitureDatas || !furnitureDatas.length) return

            const foundFurniture: IFurnitureData[] = []
            const foundFurniLines: string[] = []

            for(const furniture of furnitureDatas)
            {
                if((currentType === CatalogType.BUILDER) && !furniture.availableForBuildersClub) continue

                if((currentType === CatalogType.NORMAL) && furniture.excludeDynamic) continue

                const searchValues = [ furniture.className, furniture.name, furniture.description ].join(" ").replace(/ /gi, "").toLowerCase()

                if((currentType === CatalogType.BUILDER) && (furniture.purchaseOfferId === -1) && (furniture.rentOfferId === -1))
                {
                    if((furniture.furniLine !== "") && (foundFurniLines.indexOf(furniture.furniLine) < 0))
                    {
                        if(searchValues.indexOf(search) >= 0) foundFurniLines.push(furniture.furniLine)
                    }
                }
                else
                {
                    const foundNodes = [
                        ...GetOfferNodes(offersToNodes, furniture.purchaseOfferId),
                        ...GetOfferNodes(offersToNodes, furniture.rentOfferId)
                    ]

                    if(foundNodes.length)
                    {
                        if(searchValues.indexOf(search) >= 0) foundFurniture.push(furniture)

                        if(foundFurniture.length === 250) break
                    }
                }
            }

            const offers: IPurchasableOffer[] = []

            for(const furniture of foundFurniture) offers.push(new FurnitureOffer(furniture))

            let nodes: ICatalogNode[] = []

            FilterCatalogNode(search, foundFurniLines, rootNode, nodes)

            setSearchResult(new SearchResult(search, offers, nodes.filter(node => (node.isVisible))))
            setCurrentPage((new CatalogPage(-1, "default_3x3", new PageLocalization([], []), offers, false, 1) as ICatalogPage))
        }, 300)

        return () => clearTimeout(timeout)
    }, [ offersToNodes, currentType, rootNode, searchValue, setCurrentPage, setSearchResult ])

    return (
        <div className="illumina-input relative h-[26px] w-full">
            <input type="text" className="size-full bg-transparent pl-[9px] pr-[25px] text-[13px] italic text-black" placeholder={ LocalizeText("generic.search") } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
            {searchValue?.length > 1
                ? <i className="absolute right-1.5 top-1.5 size-[11px] cursor-pointer bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-63px_-207px] bg-no-repeat" onClick={ event => setSearchValue("") } />
                : <i className="absolute right-[3px] top-[3px] h-[18px] w-[17px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-335px_0px] bg-no-repeat" /> }
        </div>
    )
}
