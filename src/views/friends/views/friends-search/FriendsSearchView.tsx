import { HabboSearchComposer, HabboSearchResultData, HabboSearchResultEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText, OpenMessengerChat } from '../../../../api';
import { BatchUpdates, CreateMessageHook, SendMessageHook } from '../../../../hooks';
import { NitroCardAccordionItemView, NitroCardAccordionSetView, NitroCardAccordionView, NitroLayoutFlex, UserProfileIconView } from '../../../../layout';
import { NitroLayoutBase } from '../../../../layout/base';
import { useFriendsContext } from '../../context/FriendsContext';

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

    CreateMessageHook(HabboSearchResultEvent, onHabboSearchResultEvent);

    useEffect(() =>
    {
        if(!searchValue || !searchValue.length) return;

        const timeout = setTimeout(() =>
        {
            if(!searchValue || !searchValue.length) return;

            SendMessageHook(new HabboSearchComposer(searchValue));
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
                                    <NitroLayoutBase>{ result.avatarName }</NitroLayoutBase>
                                    <NitroLayoutFlex className="ms-auto align-items-center" gap={ 1 }>
                                        { result.isAvatarOnline &&
                                            <NitroLayoutBase className="nitro-friends-spritesheet icon-chat cursor-pointer" onClick={ event => OpenMessengerChat(result.avatarId) } title={ LocalizeText('friendlist.tip.im') } /> }
                                    </NitroLayoutFlex>
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
                                    <NitroLayoutBase>{ result.avatarName }</NitroLayoutBase>
                                    <NitroLayoutFlex className="ms-auto align-items-center" gap={ 1 }>
                                        { canRequestFriend(result.avatarId) &&
                                            <NitroLayoutBase className="nitro-friends-spritesheet icon-add cursor-pointer" onClick={ event => requestFriend(result.avatarId, result.avatarName) } title={ LocalizeText('friendlist.tip.addfriend') } /> }
                                    </NitroLayoutFlex>
                                </NitroCardAccordionItemView>
                            );
                        }) }
                </NitroCardAccordionSetView>
            </NitroCardAccordionView>
        </>
    );
}
