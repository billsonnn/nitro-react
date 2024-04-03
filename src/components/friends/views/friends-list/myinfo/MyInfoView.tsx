import { KeyboardEvent } from 'react';
import { Base, Column, Flex, LayoutAvatarImageView, Text } from '../../../../../common';
import { useFriends, useMessenger, useSessionInfo } from '../../../../../hooks';

export const MyInfoView = () =>
{ 
    const { userFigure = null, userName = null, motto,setMotto, saveMotto } = useSessionInfo();
    const { unreadThreads = 0 } = useMessenger();
    const { requests = [] } = useFriends();

    const onMottoKeyDown = (event: KeyboardEvent<HTMLInputElement>) =>
    {
        event.stopPropagation();

        switch(event.key)
        {
            case 'Enter':
                saveMotto((event.target as HTMLInputElement).value);
                return;
        }
    }
    
    return <Column fullHeight fullWidth className="friends-myinfo">
        <Flex fullHeight fullWidth center gap={ 1 } className="px-2">
            <Base className="myinfo-avatar">
                <LayoutAvatarImageView figure={ userFigure } direction={ 3 } position="absolute" headOnly />
            </Base>
            <Column>
                <Text variant="white" bold>{ userName }</Text>
                <input className="fi fi-white" value={ motto } onChange={ event => setMotto(event.target.value) } onKeyDown={ onMottoKeyDown } />
            </Column>
        </Flex>
        <Flex fullHeight fullWidth center>
            <Column>
                <Text variant="white" bold underline>{ unreadThreads } Unread Messages</Text>
                <Text variant="white" bold underline>{ requests.length } Friend Requests</Text>
            </Column>
        </Flex>
    </Column>
}
