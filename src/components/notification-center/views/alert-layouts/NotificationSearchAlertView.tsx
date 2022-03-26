import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText, NotificationAlertItem, NotificationUtilities } from '../../../../api';
import { AutoGrid, Button, Column, Flex, LayoutNotificationAlertView, LayoutNotificationAlertViewProps } from '../../../../common';

interface NotificationDefaultAlertViewProps extends LayoutNotificationAlertViewProps
{
    item: NotificationAlertItem;
}

export const NotificationSeachAlertView: FC<NotificationDefaultAlertViewProps> = props =>
{
    const { item = null, title = ((props.item && props.item.title) || ''), close = null, ...rest } = props;

    const [ searchValue, setSearchValue ] = useState('');
    const [ results, setResults] = useState<string[]>([]);

    const visitUrl = useCallback(() =>
    {
        NotificationUtilities.openUrl(item.clickUrl);
        
        close();
    }, [item, close]);
    
    useEffect(() =>
    {
        setResults(JSON.parse(item.messages[0]));
    }, [item])
    
    const updateSearchValue = useCallback((value: string) =>
    {
        let res = JSON.parse(item.messages[0]);
        setResults(res.filter((val: string) => val.includes(value)));
        setSearchValue(value);
    },[item])

    const isAction = (item.clickUrl && item.clickUrl.startsWith('event:'));

    return (
        <LayoutNotificationAlertView title={title} close={close} {...rest}>
            <Flex fullWidth alignItems="center" position="relative">
                <input type="text" className="form-control form-control-sm" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => updateSearchValue(event.target.value) } />
            </Flex>
            <Column fullHeight className="py-1" overflow="hidden">
                <AutoGrid gap={1} columnCount={1}>
                    {results && results.map((n, index) =>
                    { 
                        return <span key={ index }>{ n }</span>
                    })}
                </AutoGrid>
            </Column>
            <hr className="my-2"/>
            <Column alignItems="center" center gap={ 1 }>
                { !isAction && !item.clickUrl &&
                    <Button onClick={ close }>{ LocalizeText('generic.close') }</Button> }
                { item.clickUrl && (item.clickUrl.length > 0) &&
                    <Button onClick={ visitUrl }>{ LocalizeText(item.clickUrlText) }</Button> }
            </Column>
        </LayoutNotificationAlertView>
    );
}
