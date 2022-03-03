import { HabboSearchComposer, HabboSearchResultData, HabboSearchResultEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText, OpenMessengerChat, SendMessageComposer } from '../../../../api';
import { Base, Flex, NitroCardAccordionItemView, NitroCardAccordionSetView, NitroCardAccordionView, UserProfileIconView } from '../../../../common';
import { BatchUpdates, UseMessageEventHook } from '../../../../hooks';
import { useFriendsContext } from '../../FriendsContext';

export const FriendsSearchView: FC<{}> = props =>
{
    const [ searchValue, setSearchValue ] = useState('');
    const [ friendResults, setFriendResults ] = useState<HabboSearchResultData[]>([]);
    const [ otherResults, setOtherResults ] = useState<HabboSearchResultData[]>([]);
    const { canRequestFriend = null, requestFriend = null } = useFriendsContext();

    const onHabboSearchResultEvent = useCallback((event: HabboSearchResultEvent) =>
    {
        const parser = event.getParser();

        BatchUpdates(() =>
        {
            setFriendResults(parser.friends);
            setOtherResults(parser.others);
        });
    }, []);

    UseMessageEventHook(HabboSearchResultEvent, onHabboSearchResultEvent);

    useEffect(() =>
    {
        if(!searchValue || !searchValue.length) return;

        const timeout = setTimeout(() =>
        {
            if(!searchValue || !searchValue.length) return;

            SendMessageComposer(new HabboSearchComposer(searchValue));
        }, 500);

        return () => clearTimeout(timeout);
    }, [ searchValue ]);

    return (
        <>
            <input type="text" className="search-input form-control form-control-sm w-100 rounded-0" placeholder={ LocalizeText('generic.search') } value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
            <NitroCardAccordionView>
                <NitroCardAccordionSetView headerText={ LocalizeText('friendlist.search.friendscaption', [ 'cnt' ], [ friendResults.length.toString() ])  } isExpanded={ true }>
                    { (friendResults.length > 0) && friendResults.map(result =>
                        {
                            return (
                                <NitroCardAccordionItemView key={ result.avatarId }>
                                    <UserProfileIconView userId={ result.avatarId } />
                                    <Flex>{ result.avatarName }</Flex>
                                    <Flex className="ms-auto align-items-center" gap={ 1 }>
                                        { result.isAvatarOnline &&
                                            <Base className="nitro-friends-spritesheet icon-chat cursor-pointer" onClick={ event => OpenMessengerChat(result.avatarId) } title={ LocalizeText('friendlist.tip.im') } /> }
                                    </Flex>
                                </NitroCardAccordionItemView>
                            );
                        }) }
                </NitroCardAccordionSetView>
                <NitroCardAccordionSetView headerText={ LocalizeText('friendlist.search.otherscaption', [ 'cnt' ], [ otherResults.length.toString() ]) } isExpanded={ true }>
                    { (otherResults.length > 0) && otherResults.map(result =>
                        {
                            return (
                                <NitroCardAccordionItemView key={ result.avatarId }>
                                    <UserProfileIconView userId={ result.avatarId } />
                                    <Base>{ result.avatarName }</Base>
                                    <Flex className="ms-auto align-items-center" gap={ 1 }>
                                        { canRequestFriend(result.avatarId) &&
                                            <Base className="nitro-friends-spritesheet icon-add cursor-pointer" onClick={ event => requestFriend(result.avatarId, result.avatarName) } title={ LocalizeText('friendlist.tip.addfriend') } /> }
                                    </Flex>
                                </NitroCardAccordionItemView>
                            );
                        }) }
                </NitroCardAccordionSetView>
            </NitroCardAccordionView>
        </>
    );
}
