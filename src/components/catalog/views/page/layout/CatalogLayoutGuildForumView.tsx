import { CatalogGroupsComposer } from "@nitrots/nitro-renderer"
import { FC, useEffect, useState } from "react"
import { SendMessageComposer } from "../../../../../api"
import { useCatalog } from "../../../../../hooks"
import { CatalogLayoutProps } from "./CatalogLayout.types"

export const CatalogLayouGuildForumView: FC<CatalogLayoutProps> = props =>
{
    const { page = null } = props
    const [ selectedGroupIndex, setSelectedGroupIndex ] = useState<number>(0)
    const { currentOffer = null, setCurrentOffer = null, catalogOptions = null } = useCatalog()
    const { groups = null } = catalogOptions

    useEffect(() =>
    {
        SendMessageComposer(new CatalogGroupsComposer())
    }, [ page ])
    
    return null
}
