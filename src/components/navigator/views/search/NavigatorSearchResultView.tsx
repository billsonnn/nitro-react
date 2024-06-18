import { NavigatorSearchComposer, NavigatorSearchResultList } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FaBars, FaMinus, FaPlus, FaTh, FaWindowMaximize, FaWindowRestore } from 'react-icons/fa';
import { LocalizeText, NavigatorSearchResultViewDisplayMode, SendMessageComposer } from '../../../../api';
import { AutoGrid, AutoGridProps, Column, Flex, Grid, Text } from '../../../../common';
import { useNavigator } from '../../../../hooks';
import { NavigatorSearchResultItemView } from './NavigatorSearchResultItemView';

export interface NavigatorSearchResultViewProps extends AutoGridProps
{
    searchResult: NavigatorSearchResultList;
}

export const NavigatorSearchResultView: FC<NavigatorSearchResultViewProps> = props =>
{
    const { searchResult = null, ...rest } = props;
    const [ isExtended, setIsExtended ] = useState(true);
    const [ displayMode, setDisplayMode ] = useState<number>(0);

    const { topLevelContext = null } = useNavigator();

    const getResultTitle = () =>
    {
        let name = searchResult.code;

        if(!name || !name.length || LocalizeText('navigator.searchcode.title.' + name) == ('navigator.searchcode.title.' + name)) return searchResult.data;

        if(name.startsWith('${')) return name.slice(2, (name.length - 1));

        return ('navigator.searchcode.title.' + name);
    };

    const toggleDisplayMode = () =>
    {
        setDisplayMode(prevValue =>
        {
            if(prevValue === NavigatorSearchResultViewDisplayMode.LIST) return NavigatorSearchResultViewDisplayMode.THUMBNAILS;

            return NavigatorSearchResultViewDisplayMode.LIST;
        });
    };

    const showMore = () =>
    {
        if(searchResult.action == 1) SendMessageComposer(new NavigatorSearchComposer(searchResult.code, ''));
        else if(searchResult.action == 2 && topLevelContext) SendMessageComposer(new NavigatorSearchComposer(topLevelContext.code, ''));
    };

    useEffect(() =>
    {
        if(!searchResult) return;

        setIsExtended(!searchResult.closed);

        setDisplayMode(searchResult.mode);
    }, [ searchResult ]);

    const gridHasTwoColumns = (displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS);

    return (
        <Column className="bg-white rounded border border-muted" gap={ 0 }>
            <Flex fullWidth alignItems="center" className="px-2 py-1" justifyContent="between">
                <Flex grow pointer alignItems="center" gap={ 1 } onClick={ event => setIsExtended(prevValue => !prevValue) }>
                    { isExtended && <FaMinus className="text-secondary fa-icon" /> }
                    { !isExtended && <FaPlus className="text-secondary fa-icon" /> }
                    <Text>{ LocalizeText(getResultTitle()) }</Text>
                </Flex>
                <div className="flex gap-2">
                    { (displayMode === NavigatorSearchResultViewDisplayMode.LIST) && <FaTh className="text-secondary fa-icon" onClick={ toggleDisplayMode } /> }
                    { (displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS) && <FaBars className="text-secondary fa-icon" onClick={ toggleDisplayMode } /> }
                    { (searchResult.action > 0) && (searchResult.action === 1) && <FaWindowMaximize className="text-secondary fa-icon" onClick={ showMore } /> }
                    { (searchResult.action > 0) && (searchResult.action !== 1) && <FaWindowRestore className="text-secondary fa-icon" onClick={ showMore } /> }
                </div>

            </Flex> { isExtended &&
                <>
                    {
                        gridHasTwoColumns ? <AutoGrid columnCount={ 3 } { ...rest } className="mx-2" columnMinHeight={ 130 } columnMinWidth={ 110 }>
                            { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) => <NavigatorSearchResultItemView key={ index } roomData={ room } thumbnail={ true } />) }
                        </AutoGrid> : <Grid className="navigator-grid" columnCount={ 1 } gap={ 0 }>
                            { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) => <NavigatorSearchResultItemView key={ index } roomData={ room } />) }
                        </Grid>
                    }
                </>
            }
        </Column>
        // <div className="nitro-navigator-search-result bg-white rounded mb-2 overflow-hidden">
        //     <div className="flex flex-col">
        //         <div className="flex items-center px-2 py-1 text-black">
        //             <i className={ 'text-secondary fas ' + (isExtended ? 'fa-minus' : 'fa-plus') } onClick={ toggleExtended }></i>
        //             <div className="ms-2 !flex-grow">{ LocalizeText(getResultTitle()) }</div>
        //             <i className={ 'text-secondary fas ' + classNames({ 'fa-bars': (displayMode === NavigatorSearchResultViewDisplayMode.LIST), 'fa-th': displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS })}></i>
        //         </div>
        //         { isExtended &&
        //             <div className={ 'nitro-navigator-result-list row row-cols-' + classNames({ '1': (displayMode === NavigatorSearchResultViewDisplayMode.LIST), '2': (displayMode >= NavigatorSearchResultViewDisplayMode.THUMBNAILS) }) }>
        //                 { searchResult.rooms.length > 0 && searchResult.rooms.map((room, index) =>
        //                     {
        //                         return <NavigatorSearchResultItemView key={ index } roomData={ room } />
        //                     }) }
        //             </div> }
        //     </div>
        // </div>
        // <div className="nitro-navigator-result-list p-2">
        //     <div className="flex mb-2 small cursor-pointer" onClick={ toggleList }>
        //         <i className={ "fas " + classNames({ 'fa-plus': !isExtended, 'fa-minus': isExtended })}></i>
        //         <div className="align-self-center w-full ml-2">{ LocalizeText(getListCode()) }</div>
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
};
