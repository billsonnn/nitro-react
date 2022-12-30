import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavigatorSavedSearch } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Column, Flex, Text } from '../../../../common';
import { NavigatorSearchSavesResultItemView } from './NavigatorSearchSavesResultItemView';

export interface NavigatorSearchSavesResultViewProps
{
    searchs: NavigatorSavedSearch[]
}

export const NavigatorSearchSavesResultView: FC<NavigatorSearchSavesResultViewProps> = props =>
{
    const { searchs = [] } = props;

    return (
        <Column className="nitro-navigator-search-saves-result">
            <Flex className="badge p-1 bg-orange" gap={ 1 }>
                <FontAwesomeIcon color="white" icon="bolt-lightning" />
                <Text variant="white">{ LocalizeText('navigator.quick.links.title') }</Text>
            </Flex>
            <Column className="p-1" style={ { overflowX: 'hidden', overflowY: 'auto' } }>
                { (searchs && searchs.length > 0) &&
                    searchs.map((search: NavigatorSavedSearch) => <NavigatorSearchSavesResultItemView key={ search.id } search={ search } />)
                }
            </Column>
        </Column>
    );
}
