import { HabboSearchComposer, HabboSearchResultData, HabboSearchResultEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { LocalizeText, OpenMessengerChat, SendMessageComposer } from '../../../../api';
import { Column, NitroCardAccordionItemView, NitroCardAccordionSetView, NitroCardAccordionSetViewProps, Text, UserProfileIconView } from '../../../../common';
import { useFriends, useMessageEvent } from '../../../../hooks';

interface FriendsSearchViewProps extends NitroCardAccordionSetViewProps
{

}

export const FriendsSearchView: FC<FriendsSearchViewProps> = props =>
{
    const { ...rest } = props;
    const [ searchValue, setSearchValue ] = useState('');
    const [ friendResults, setFriendResults ] = useState<HabboSearchResultData[]>(null);
    const [ otherResults, setOtherResults ] = useState<HabboSearchResultData[]>(null);
    const { canRequestFriend = null, requestFriend = null } = useFriends();

    useMessageEvent<HabboSearchResultEvent>(HabboSearchResultEvent, event =>
    {
        const parser = event.getParser();

        setFriendResults(parser.friends);
        setOtherResults(parser.others);
    });

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
        <NitroCardAccordionSetView { ...rest }>
            <input className="search-input form-control form-control-sm w-full rounded-0" maxLength={ 50 } placeholder={ LocalizeText('generic.search') } type="text" value={ searchValue } onChange={ event => setSearchValue(event.target.value) } />
            <div className="flex flex-col">
                { friendResults &&
                    <>
                        { (friendResults.length === 0) &&
                            <Text bold small className="px-2 py-1">{ LocalizeText('friendlist.search.nofriendsfound') }</Text> }
                        { (friendResults.length > 0) &&
                            <Column gap={ 0 }>
                                <Text bold small className="px-2 py-1">{ LocalizeText('friendlist.search.friendscaption', [ 'cnt' ], [ friendResults.length.toString() ]) }</Text>
                                <hr className="mx-2 mt-0 mb-1 text-black" />
                                <Column gap={ 0 }>
                                    { friendResults.map(result =>
                                    {
                                        return (
                                            <NitroCardAccordionItemView key={ result.avatarId } className="px-2 py-1" justifyContent="between">
                                                <div className="flex items-center gap-1">
                                                    <UserProfileIconView userId={ result.avatarId } />
                                                    <div>{ result.avatarName }</div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    { result.isAvatarOnline &&
                                                        <div className="nitro-friends-spritesheet icon-chat cursor-pointer" title={ LocalizeText('friendlist.tip.im') } onClick={ event => OpenMessengerChat(result.avatarId) } /> }
                                                </div>
                                            </NitroCardAccordionItemView>
                                        );
                                    }) }
                                </Column>
                            </Column> }
                    </> }
                { otherResults &&
                    <>
                        { (otherResults.length === 0) &&
                            <Text bold small className="px-2 py-1">{ LocalizeText('friendlist.search.noothersfound') }</Text> }
                        { (otherResults.length > 0) &&
                            <Column gap={ 0 }>
                                <Text bold small className="px-2 py-1">{ LocalizeText('friendlist.search.otherscaption', [ 'cnt' ], [ otherResults.length.toString() ]) }</Text>
                                <hr className="mx-2 mt-0 mb-1 text-black" />
                                <Column gap={ 0 }>
                                    { otherResults.map(result =>
                                    {
                                        return (
                                            <NitroCardAccordionItemView key={ result.avatarId } className="px-2 py-1" justifyContent="between">
                                                <div className="flex items-center gap-1">
                                                    <UserProfileIconView userId={ result.avatarId } />
                                                    <div>{ result.avatarName }</div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    { canRequestFriend(result.avatarId) &&
                                                        <div className="nitro-friends-spritesheet icon-add cursor-pointer" title={ LocalizeText('friendlist.tip.addfriend') } onClick={ event => requestFriend(result.avatarId, result.avatarName) } /> }
                                                </div>
                                            </NitroCardAccordionItemView>
                                        );
                                    }) }
                                </Column>
                            </Column> }
                    </> }
            </div>
        </NitroCardAccordionSetView>
    );
};
