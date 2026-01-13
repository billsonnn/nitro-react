import { FC } from "react"
import { ICatalogNode } from "../../../../api"
import { useCatalog } from "../../../../hooks"
import { CatalogIconView } from "../catalog-icon/CatalogIconView"
import { CatalogNavigationSetView } from "./CatalogNavigationSetView"

interface CatalogNavigationItemViewProps {
  node: ICatalogNode;
  child?: boolean;
}

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = ({ node = null, child = false }) => {
    const { activateNode = null } = useCatalog()

    const getItemClasses = () => {
        return `
            flex items-center justify-between px-[9px] p-[3px] w-[166px] cursor-pointer group
            ${node.isActive && !child ? "dark" : ""}
            ${!child ? "illumina-card-item mb-[3px]" : "h-5 pl-4 italic"}
            ${node.isActive && child ? "bg-[url('/client-assets/images/catalogue/child-item-bg.png?v=2451779')] dark:bg-[url('/client-assets/images/catalogue/child-item-dark-bg.png?v=2451779')]" : ""}
            ${child ? "hover:bg-[url('/client-assets/images/catalogue/child-item-bg.png?v=2451779')] dark:hover:bg-[url('/client-assets/images/catalogue/child-item-dark-bg.png?v=2451779')]" : ""}
        `
    }

    const getTextClasses = () => {
        return `
            text-xs font-semibold !leading-3 w-full truncate text-clip
            ${!node.isActive && child ? "text-[#63615d] dark:text-[#acacac] group-hover:text-[#63615d] dark:group-hover:text-[#acacac] group-hover:[text-shadow:_0_1px_0_#CCCCCC] dark:group-hover:[text-shadow:_0_1px_0_#211D19]" : ""}
            ${!node.isActive && !child ? "text-dark [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]" : ""}
            ${node.isActive && child ? "text-[#2a2824] dark:text-white [text-shadow:_0_1px_0_#CCCCCC] dark:[text-shadow:_0_1px_0_#211D19]" : ""}
            ${node.isActive && !child ? "text-white [text-shadow:_0_1px_0_#33312B]" : ""}
        `
    }

    return (
        <>
            <div className={getItemClasses()} onClick={(event) => activateNode(node)}>
                <div className="flex w-[calc(100%-5px)] items-center">
                    <div className="w-[31px]">
                        <CatalogIconView icon={node.iconId} />
                    </div>
                    <p className={getTextClasses()}>{node.localization}</p>
                </div>
                {node.isBranch && (
                    <>
                        {node.isOpen && <i className="h-[5px] w-[9px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-277px_-32px]" />}
                        {!node.isOpen && <i className="h-[9px] w-[5px] bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-270px_-32px]" />}
                    </>
                )}
            </div>
            {node.isOpen && node.isBranch && <CatalogNavigationSetView node={node} child={true} />}
        </>
    )
}
