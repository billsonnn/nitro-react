import { ProviderProps } from 'react';
import { MessengerFriend } from '../common/MessengerFriend';
import { MessengerRequest } from '../common/MessengerRequest';
import { MessengerSettings } from '../common/MessengerSettings';

export interface IFriendsContext
{
    friends: MessengerFriend[];
    requests: MessengerRequest[];
    settings: MessengerSettings;
    canRequestFriend: (userId: number) => boolean;
    requestFriend: (userId: number, userName: string) => void;
    acceptFriend: (userId: number) => void;
    declineFriend: (userId: number, declineAll?: boolean) => void;
}

export interface FriendsContextProps extends ProviderProps<IFriendsContext>
{

}
