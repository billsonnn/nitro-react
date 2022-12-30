import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavigatorDeleteSavedSearchComposer, NavigatorSavedSearch, NavigatorSearchComposer } from '@nitrots/nitro-renderer';
import { FC, useState } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../../api';
import { Flex, Text } from '../../../../common';

export interface NavigatorSearchSavesResultItemViewProps
{
    search: NavigatorSavedSearch
}

export const NavigatorSearchSavesResultItemView: FC<NavigatorSearchSavesResultItemViewProps> = props =>
{
    const { search = null } = props;
    const [ isHoverText, setIsHoverText ] = useState<boolean>(false);
    const [ currentIndex, setCurrentIndex ] = useState<number>(0);

    const onHover = (searchId: number) =>
    {
        setCurrentIndex(searchId);
        setIsHoverText(true);
    }

    const onLeave = () =>
    {
        setCurrentIndex(0);
        setIsHoverText(false);
    }

    return (
        <Flex grow pointer alignItems="center" gap={ 1 } onMouseEnter={ () => onHover(search.id) } onMouseLeave={ () => onLeave() }>
            { (isHoverText && currentIndex === search.id) &&
            <FontAwesomeIcon color="red" icon="subtract" title={ LocalizeText('navigator.tooltip.remove.saved.search') } onClick={ () => SendMessageComposer(new NavigatorDeleteSavedSearchComposer(search.id)) } /> }
            <Text pointer variant="black" title={ LocalizeText('navigator.tooltip.open.saved.search') } onClick={ () => SendMessageComposer(new NavigatorSearchComposer(search.code.split('.').reverse()[0], search.filter)) }>{ search.filter !== '' ? LocalizeText('navigator.searchcode.title.query') + ': ' + (!search.filter.split(':')[1] ? search.filter : search.filter.split(':')[1]) : LocalizeText(`${ search.code }`) }</Text>
        </Flex>
    );
}
