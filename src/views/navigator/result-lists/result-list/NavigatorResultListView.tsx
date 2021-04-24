import classNames from 'classnames';
import { MouseEvent, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { NavigatorResultListViewDisplayMode, NavigatorResultListViewProps } from './NavigatorResultListView.types';
import { NavigatorResultView } from './result/NavigatorResultView';

export function NavigatorResultListView(props: NavigatorResultListViewProps): JSX.Element
{
    const { resultList = null } = props;

    const [ isExtended, setIsExtended ]     = useState(true);
    const [ displayMode, setDisplayMode ]   = useState<number>(0);

    function toggleList(): void
    {
        setIsExtended(!isExtended);
    }

    useEffect(() =>
    {
        setDisplayMode(resultList.mode);
    }, [ resultList ]);

    function toggleDisplayMode(event: MouseEvent): void
    {
        if(event) event.stopPropagation();
        
        const newDisplayMode = displayMode === NavigatorResultListViewDisplayMode.LIST ? NavigatorResultListViewDisplayMode.THUMBNAILS : NavigatorResultListViewDisplayMode.LIST;
        setDisplayMode(newDisplayMode);
    }

    function getListCode(): string
    {
        let name = resultList.code;

        if((!name || name.length === 0) && (resultList.data && resultList.data.length > 0))
        {
            return resultList.data;
        }

        if(resultList.code.startsWith('${'))
        {
            name = name.substr(2, (name.length - 3));
        }
        else
        {
            name = ('navigator.searchcode.title.' + name);
        }

        return name;
    }

    return (
        <div className="nitro-navigator-result-list p-2">
            <div className="d-flex mb-2 small cursor-pointer" onClick={ toggleList }>
                <i className={ "fas " + classNames({ 'fa-plus': !isExtended, 'fa-minus': isExtended })}></i>
                <div className="align-self-center w-100 ml-2">{ LocalizeText(getListCode()) }</div>
                <i className={ "fas " + classNames({ 'fa-bars': displayMode === NavigatorResultListViewDisplayMode.LIST, 'fa-th': displayMode >= NavigatorResultListViewDisplayMode.THUMBNAILS })} onClick={ toggleDisplayMode }></i>
            </div>
            <div className={ 'row mr-n2 row-cols-' + classNames({ '1': displayMode === NavigatorResultListViewDisplayMode.LIST, '2': displayMode >= NavigatorResultListViewDisplayMode.THUMBNAILS }) }>
                { isExtended && resultList && resultList.rooms.map((room, index) =>
                    {
                        return <NavigatorResultView key={ index } result={ room } />
                    })
                }
            </div>
        </div>
    );
}
