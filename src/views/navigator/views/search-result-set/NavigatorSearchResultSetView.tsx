import { FC } from 'react';
import { useNavigatorContext } from '../../context/NavigatorContext';
import { NavigatorSearchResultView } from '../search-result/NavigatorSearchResultView';
import { NavigatorSearchResultSetViewProps } from './NavigatorSearchResultSetView.types';

export const NavigatorSearchResultSetView: FC<NavigatorSearchResultSetViewProps> = props =>
{
    const { navigatorState = null } = useNavigatorContext();
    const { searchResult = null } = navigatorState;

    if(!searchResult || !searchResult.results.length) return null;

    return (
        <>
            <div className="h-100 overflow-auto">
                { (searchResult.results.map((result, index) =>
                    {
                        return <NavigatorSearchResultView key={ index } searchResult={ result } />
                    })) }
            </div>
        </>
    );
}
