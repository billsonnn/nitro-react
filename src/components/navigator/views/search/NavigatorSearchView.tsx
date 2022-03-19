import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, KeyboardEvent, useState } from 'react';
import { LocalizeText } from '../../../../api';
import { Button } from '../../../../common/Button';
import { Flex } from '../../../../common/Flex';
import { SearchFilterOptions } from '../../common/SearchFilterOptions';
import { useNavigatorContext } from '../../NavigatorContext';

export interface NavigatorSearchViewProps
{
    sendSearch: (searchValue: string, contextCode: string) => void;
}

export const NavigatorSearchView: FC<NavigatorSearchViewProps> = props =>
{
    const { sendSearch = null } = props;
    const [ searchFilterIndex, setSearchFilterIndex ] = useState(0);
    const [ searchValue, setSearchValue ] = useState('');
    const [ lastSearchQuery, setLastSearchQuery ] = useState('');
    const { topLevelContext = null, lastSearchValue = null } = useNavigatorContext();

    const processSearch = () =>
    {
        if(!topLevelContext) return;

        let searchFilter = SearchFilterOptions[searchFilterIndex];

        if(!searchFilter) searchFilter = SearchFilterOptions[0];

        const searchQuery = ((searchFilter.query ? (searchFilter.query + ':') : '') + searchValue);

        if(lastSearchQuery === searchQuery) return;

        setLastSearchQuery(searchQuery);
        sendSearch((searchQuery || ''), topLevelContext.code);

        lastSearchValue.current = (searchQuery || '');
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key !== 'Enter') return;

        processSearch();
    };

    return (
        <Flex fullWidth gap={ 1 }>
            <Flex shrink>
                <select className="form-select form-select-sm" value={ searchFilterIndex } onChange={ event => setSearchFilterIndex(parseInt(event.target.value)) }>
                    { SearchFilterOptions.map((filter, index) =>
                    {
                        return <option key={ index } value={ index }>{ LocalizeText('navigator.filter.' + filter.name) }</option>
                    }) }
                </select>
            </Flex>
            <Flex fullWidth gap={ 1 }>
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('navigator.filter.input.placeholder') } value={ searchValue }  onChange={ event => setSearchValue(event.target.value) } onKeyDown={ event => handleKeyDown(event) } />
                <Button variant="primary" onClick={ processSearch }>
                    <FontAwesomeIcon icon="search" />
                </Button>
            </Flex>
        </Flex>
    );
}
