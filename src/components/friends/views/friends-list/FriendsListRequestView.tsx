import { FC } from 'react';
import { LocalizeText, MessengerRequest } from '../../../../api';
import { Base, Button, Column, Flex, NitroCardAccordionItemView, NitroCardAccordionSetView, NitroCardAccordionSetViewProps, UserProfileIconView } from '../../../../common';
import { useFriends } from '../../../../hooks';

export const FriendsListRequestView: FC<NitroCardAccordionSetViewProps> = props =>
{
    const { children = null, ...rest } = props;
    const { requests = [], requestResponse = null } = useFriends();

    if(!requests.length) return null;

    const FriendsListRequestItemView: FC<{ request: MessengerRequest }> = props =>
    {
        const { request = null } = props;

        if(!request) return null;

        return (
            <NitroCardAccordionItemView justifyContent="between" className="px-2 py-1">
                <Flex alignItems="center" gap={ 1 }>
                    <UserProfileIconView userId={ request.id } />
                    <div>{ request.name }</div>
                </Flex>
                <Flex alignItems="center" gap={ 1 }>
                    <Base className="nitro-friends-spritesheet icon-accept cursor-pointer" onClick={ event => requestResponse(request.id, true) } />
                    <Base className="nitro-friends-spritesheet icon-deny cursor-pointer" onClick={ event => requestResponse(request.id, false) } />
                </Flex>
            </NitroCardAccordionItemView>
        );
    }

    return (
        <NitroCardAccordionSetView { ...rest }>
            <Column fullHeight justifyContent="between" gap={ 1 }>
                <Column gap={ 0 }>
                    { requests.map((request, index) => <FriendsListRequestItemView key={ index } request={ request } />) }
                </Column>
                <Flex justifyContent="center" className="px-2 py-1">
                    <Button onClick={ event => requestResponse(-1, false) }>
                        { LocalizeText('friendlist.requests.dismissall') }
                    </Button>
                </Flex>
            </Column>
            { children }
        </NitroCardAccordionSetView>
    );
}
