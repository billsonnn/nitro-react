import React, { FC, KeyboardEvent, useCallback, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { useNavigatorContext } from '../../context/NavigatorContext';
import { NavigatorSearchViewProps, SearchFilterOptions } from './NavigatorSearchView.types';

export const NavigatorSearchView: FC<NavigatorSearchViewProps> = props =>
{
    const { sendSearch = null } = props;
    const [ searchFilterIndex, setSearchFilterIndex ] = useState(0);
    const [ searchValue, setSearchValue ] = useState('');
    const [ lastSearchQuery, setLastSearchQuery ] = useState('');
    const { navigatorState = null } = useNavigatorContext();
    const { topLevelContext = null } = navigatorState;

    const processSearch = useCallback(() =>
    {
        if(!topLevelContext) return;

        let searchFilter = SearchFilterOptions[searchFilterIndex];

        if(!searchFilter) searchFilter = SearchFilterOptions[0];

        const searchQuery = ((searchFilter.query ? (searchFilter.query + ':') : '') + searchValue);

        if(lastSearchQuery === searchQuery) return;

        setLastSearchQuery(searchQuery);
        sendSearch((searchQuery || ''), topLevelContext.code);
    }, [ lastSearchQuery, searchFilterIndex, searchValue, topLevelContext, sendSearch ]);

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        processSearch();
    };

    return (
        <div className="d-flex w-100 mb-2">
            <div>
                <select className="form-select form-select-sm flex-shrink-1" value={ searchFilterIndex } onChange={ event => setSearchFilterIndex(parseInt(event.target.value)) }>
                    { SearchFilterOptions.map((filter, index) =>
                    {
                        return <option key={ index } value={ index }>{ LocalizeText('navigator.filter.' + filter.name) }</option>
                    }) }
                </select>
            </div>
            <div className="ms-2 flex-grow-1">
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('navigator.filter.input.placeholder') } value={ searchValue }  onChange={ event => setSearchValue(event.target.value) } onKeyDown={ event => handleKeyDown(event) } />
            </div>
            <div className="ms-2">
                <button type="button" className="btn btn-primary btn-sm" onClick={ processSearch }>
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </div>
    );
}
