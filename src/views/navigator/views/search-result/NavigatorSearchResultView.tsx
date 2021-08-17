import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { NavigatorSearchResultItemView } from '../search-result-item/NavigatorSearchResultItemView';
import { NavigatorSearchResultViewDisplayMode, NavigatorSearchResultViewProps } from './NavigatorSearchResultView.types';

export const NavigatorSearchResultView: FC<NavigatorSearchResultViewProps> = props =>
{
    const { searchResult = null } = props;

    const [ isExtended, setIsExtended ]     = useState(true);
    const [ displayMode, setDisplayMode ]   = useState<number>(0);

    useEffect(() =>
    {
        if(!searchResult) return;

        //setIsExtended(searchResult.closed);
        //setDisplayMode(searchResult.mode);
    }, [ searchResult ]);

    function getResultTitle(): string
    {
        let name = searchResult.code;

        if(!name || !name.length) return searchResult.data;

        if(name.startsWith('${')) return name.substr(2, (name.length - 3));

        return ('navigator.searchcode.title.' + name);
    }

    function toggleExtended(): void
    {
        setIsExtended(prevValue =>
            {
                return !prevValue;
            });
    }

    function toggleDisplayMode(): void
    {
        setDisplayMode(prevValue =>
            {
                if(prevValue === NavigatorSearchResultViewDisplayMode.LIST) return NavigatorSearchResultViewDisplayMode.THUMBNAILS;

                return NavigatorSearchResultViewDisplayMode.LIST;
            });
    }
    
    return (
        <div className="nitro-navigator-search-result bg-white rounded mb-2 overflow-hidden">
            <div className="d-flex flex-column">
                <div className="d-flex align-items-center px-2 py-1 text-black">
                    <i className={ 'text-secondary fas ' + (isExtended ? 'fa-minus' : 'fa-plus') } onClick={ toggleExtended }></i>
                    <div className="ms-2 flex-grow-1">{ LocalizeText(getResultTitle()) }</div>
                    <i className={ 'text-secondary fas ' + classNames({ 'fa-bars': (displayMode === NavigatorSearchResultViewDisplayMode.LIST), 'fa-th': displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS })}></i>
                </div>
                { isExtended &&
                    <div className={ 'nitro-navigator-result-list row row-cols-' + classNames({ '1': (displayMode === NavigatorSearchResultViewDisplayMode.LIST), '2': (displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS) }) }>
                        { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) =>
                            {
                                return <NavigatorSearchResultItemView key={ index } roomData={ room } />
                            }) }
                    </div> }
            </div>
        </div>
        // <div className="nitro-navigator-result-list p-2">
        //     <div className="d-flex mb-2 small cursor-pointer" onClick={ toggleList }>
        //         <i className={ "fas " + classNames({ 'fa-plus': !isExtended, 'fa-minus': isExtended })}></i>
        //         <div className="align-self-center w-100 ml-2">{ LocalizeText(getListCode()) }</div>
        //         <i className={ "fas " + classNames({ 'fa-bars': displayMode === NavigatorResultListViewDisplayMode.LIST, 'fa-th': displayMode >= NavigatorResultListViewDisplayMode.THUMBNAILS })} onClick={ toggleDisplayMode }></i>
        //     </div>
        //     <div className={ 'row mr-n2 row-cols-' + classNames({ '1': displayMode === NavigatorResultListViewDisplayMode.LIST, '2': displayMode >= NavigatorResultListViewDisplayMode.THUMBNAILS }) }>
        //         { isExtended && resultList && resultList.rooms.map((room, index) =>
        //             {
        //                 return <NavigatorResultView key={ index } result={ room } />
        //             })
        //         }
        //     </div>
        // </div>
    );
}
