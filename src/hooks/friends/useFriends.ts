import { AcceptFriendMessageComposer, DeclineFriendMessageComposer, FollowFriendMessageComposer, FriendListFragmentEvent, FriendListUpdateEvent, FriendParser, FriendRequestsEvent, GetFriendRequestsComposer, MessengerInitComposer, MessengerInitEvent, NewFriendRequestEvent, RequestFriendComposer, SetRelationshipStatusComposer } from '@nitrots/nitro-renderer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBetween } from 'use-between';
import { CloneObject, MessengerFriend, MessengerRequest, MessengerSettings, SendMessageComposer } from '../../api';
import { UseMessageEventHook } from '../messages';

const useFriendsState = () =>
{
    const [ friends, setFriends ] = useState<MessengerFriend[]>([]);
    const [ requests, setRequests ] = useState<MessengerRequest[]>([]);
    const [ sentRequests, setSentRequests ] = useState<number[]>([]);
    const [ settings, setSettings ] = useState<MessengerSettings>(null);

    const onlineFriends = useMemo(() =>
    {
        const onlineFriends = friends.filter(friend => friend.online);

        onlineFriends.sort((a, b) =>
        {
            if( a.name < b.name ) return -1;

            if( a.name > b.name ) return 1;

            return 0;
        });

        return onlineFriends;
    }, [ friends ]);

    const offlineFriends = useMemo(() =>
    {
        const offlineFriends = friends.filter(friend => !friend.online);

        offlineFriends.sort((a, b) =>
        {
            if( a.name < b.name ) return -1;

            if( a.name > b.name ) return 1;

            return 0;
        });

        return offlineFriends;
    }, [ friends ]);

    const followFriend = useCallback((friend: MessengerFriend) => SendMessageComposer(new FollowFriendMessageComposer(friend.id)), []);
    const updateRelationship = useCallback((friend: MessengerFriend, type: number) => ((type !== friend.relationshipStatus) && SendMessageComposer(new SetRelationshipStatusComposer(friend.id, type))), []);

    const getFriend = useCallback((userId: number) =>
    {
        for(const friend of friends)
        {
            if(friend.id === userId) return friend;
        }

        return null;
    }, [ friends ]);

    const canRequestFriend = useCallback((userId: number) =>
    {
        if(getFriend(userId)) return false;

        if(requests.find(request => (request.requesterUserId === userId))) return false;

        if(sentRequests.indexOf(userId) >= 0) return false;

        return true;
    }, [ requests, sentRequests, getFriend ]);

    const requestFriend = useCallback((userId: number, userName: string) =>
    {
        if(!canRequestFriend(userId)) return false;

        setSentRequests(prevValue =>
        {
            const newSentRequests = [ ...prevValue ];

            newSentRequests.push(userId);

            return newSentRequests;
        });

        SendMessageComposer(new RequestFriendComposer(userName));
    }, [ canRequestFriend ]);

    const requestResponse = useCallback((requestId: number, flag: boolean) =>
    {
        if(requestId === -1 && !flag)
        {
            SendMessageComposer(new DeclineFriendMessageComposer(true));

            setRequests([]);
        }
        else
        {
            setRequests(prevValue =>
            {
                const newRequests = [ ...prevValue ];
                const index = newRequests.findIndex(request => (request.id === requestId));

                if(index === -1) return prevValue;

                if(flag)
                {
                    SendMessageComposer(new AcceptFriendMessageComposer(newRequests[index].id));
                }
                else
                {
                    SendMessageComposer(new DeclineFriendMessageComposer(false, newRequests[index].id));
                }

                newRequests.splice(index, 1);

                return newRequests;
            });
        }
    }, []);

    const onMessengerInitEvent = useCallback((event: MessengerInitEvent) =>
    {
        const parser = event.getParser();

        setSettings(new MessengerSettings(
            parser.userFriendLimit,
            parser.normalFriendLimit,
            parser.extendedFriendLimit,
            parser.categories));

        SendMessageComposer(new GetFriendRequestsComposer());
    }, []);

    UseMessageEventHook(MessengerInitEvent, onMessengerInitEvent);

    const onFriendsFragmentEvent = useCallback((event: FriendListFragmentEvent) =>
    {
        const parser = event.getParser();

        setFriends(prevValue =>
        {
            const newValue = [ ...prevValue ];

            for(const friend of parser.fragment)
            {
                const index = newValue.findIndex(existingFriend => (existingFriend.id === friend.id));
                const newFriend = new MessengerFriend();
                newFriend.populate(friend);

                if(index > -1) newValue[index] = newFriend;
                else newValue.push(newFriend);
            }

            return newValue;
        });
    }, []);

    UseMessageEventHook(FriendListFragmentEvent, onFriendsFragmentEvent);

    const onFriendsUpdateEvent = useCallback((event: FriendListUpdateEvent) =>
    {
        const parser = event.getParser();

        setFriends(prevValue =>
        {
            const newValue = [ ...prevValue ];

            const processUpdate = (friend: FriendParser) =>
            {
                const index = newValue.findIndex(existingFriend => (existingFriend.id === friend.id));

                if(index === -1)
                {
                    const newFriend = new MessengerFriend();
                    newFriend.populate(friend);

                    newValue.unshift(newFriend);
                }
                else
                {
                    newValue[index].populate(friend);
                }
            }

            for(const friend of parser.addedFriends) processUpdate(friend);

            for(const friend of parser.updatedFriends) processUpdate(friend);

            for(const removedFriendId of parser.removedFriendIds)
            {
                const index = newValue.findIndex(existingFriend => (existingFriend.id === removedFriendId));

                if(index > -1) newValue.splice(index, 1);
            }

            return newValue;
        });
    }, []);

    UseMessageEventHook(FriendListUpdateEvent, onFriendsUpdateEvent);

    const onFriendRequestsEvent = useCallback((event: FriendRequestsEvent) =>
    {
        const parser = event.getParser();

        setRequests(prevValue =>
        {
            const newValue = [ ...prevValue ];

            for(const request of parser.requests)
            {
                const index = newValue.findIndex(existing => (existing.requesterUserId === request.requesterUserId));

                if(index > 0)
                {
                    newValue[index] = CloneObject(newValue[index]);
                    newValue[index].populate(request);
                }
                else
                {
                    const newRequest = new MessengerRequest();
                    newRequest.populate(request);

                    newValue.push(newRequest);
                }
            }

            return newValue;
        });
    }, []);

    UseMessageEventHook(FriendRequestsEvent, onFriendRequestsEvent);

    const onNewFriendRequestEvent = useCallback((event: NewFriendRequestEvent) =>
    {
        const parser = event.getParser();
        const request = parser.request;

        setRequests(prevValue =>
        {
            const newRequests = [ ...prevValue ];

            const index = newRequests.findIndex(existing => (existing.requesterUserId === request.requesterUserId));

            if(index === -1)
            {
                const newRequest = new MessengerRequest();
                newRequest.populate(request);

                newRequests.push(newRequest);
            }

            return newRequests;
        });
    }, []);

    UseMessageEventHook(NewFriendRequestEvent, onNewFriendRequestEvent);

    useEffect(() =>
    {
        SendMessageComposer(new MessengerInitComposer());
    }, []);

    return { friends, requests, sentRequests, settings, onlineFriends, offlineFriends, getFriend, canRequestFriend, requestFriend, requestResponse, followFriend, updateRelationship };
}

export const useFriends = () => useBetween(useFriendsState);
