import React, { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../utils/LocalizeText';
import { INavigatorSearchFilter, NavigatorSearchViewProps } from './NavigatorSearchView.types';

export const NavigatorSearchView: FC<NavigatorSearchViewProps> = props =>
{
    const searchFilters: INavigatorSearchFilter[] = [
        {
            name: 'anything',
            query: null
        },
        {
            name: 'room.name',
            query: 'roomname'
        },
        {
            name: 'owner',
            query: 'owner'
        },
        {
            name: 'tag',
            query: 'tag'
        },
        {
            name: 'group',
            query: 'group'
        }
    ];

    const [ searchFilter, setSearchFilter ] = useState<number>(0);
    const [ searchString, setSearchString ] = useState<string>('');

    const search = useCallback(() =>
    {
        if(!searchFilters[searchFilter]) return;
        
        props.onSendSearch(searchFilters[searchFilter].query, searchString);
    }, [ searchFilter, searchString ]);

    useEffect(() =>
    {
        search();
    }, [ searchFilter ]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) =>
    {
        if(event.key === 'Enter') search();
    };

    return (
        <div className="d-flex w-100 mb-2">
            <div>
                <select className="form-select form-select-sm flex-shrink-1" value={ searchFilter } onChange={ event => setSearchFilter(parseInt(event.target.value)) }>
                    { searchFilters.map((filter, index) =>
                    {
                        return <option value={ index }>{ LocalizeText('navigator.filter.' + filter.name) }</option>
                    }) }
                </select>
            </div>
            <div className="ms-2 flex-grow-1">
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('navigator.filter.input.placeholder') } value={ searchString }  onChange={ event => setSearchString(event.target.value) } onKeyDown={ event => handleKeyDown(event) } />
            </div>
            <div className="ms-2">
                <button type="button" className="btn btn-primary btn-sm" onClick={ search }>
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </div>
    );
}
