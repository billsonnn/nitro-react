import { ModeratorUserInfoData, ModtoolRequestUserInfoComposer, ModtoolUserInfoEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { ModToolsOpenUserChatlogEvent } from '../../../../events/mod-tools/ModToolsOpenUserChatlogEvent';
import { CreateMessageHook, dispatchUiEvent, SendMessageHook } from '../../../../hooks';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../layout';
import { AvatarImageView } from '../../../shared/avatar-image/AvatarImageView';
import { ModToolsUserViewProps } from './ModToolsUserView.types';

export const ModToolsUserView: FC<ModToolsUserViewProps> = props =>
{
    const { onCloseClick = null, userId = null, simple = true } = props;
    const [userInfo, setUserInfo] = useState<ModeratorUserInfoData>(null);

    useEffect(() =>
    {
        SendMessageHook(new ModtoolRequestUserInfoComposer(userId));
    }, [userId]);


    const onModtoolUserInfoEvent = useCallback((event: ModtoolUserInfoEvent) =>
    {
        const parser = event.getParser();

        if(!parser || parser.data.userId !== userId) return;

        setUserInfo(parser.data);
    }, [setUserInfo, userId]);

    CreateMessageHook(ModtoolUserInfoEvent, onModtoolUserInfoEvent);
    
    return (
        <NitroCardView className="nitro-mod-tools-user" simple={true}>
            <NitroCardHeaderView headerText={'User Info: ' + (userInfo ? userInfo.userName : '')} onCloseClick={() => onCloseClick()} />
            <NitroCardContentView className="text-black">
                {userInfo &&
                    <>
                        {!simple &&
                            <div className="col-sm-3 px-0 d-flex align-items-center">
                                <AvatarImageView figure={userInfo.figure} direction={2} />
                            </div>
                        }
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <div>
                                <b>Name:</b> <span className="username fw-bold cursor-pointer">{userInfo.userName}</span>
                            </div>
                            <button className="btn btn-sm btn-primary" onClick={() => dispatchUiEvent(new ModToolsOpenUserChatlogEvent(userId))}>Chatlog</button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <div>
                                <b>CFHs:</b> {userInfo.cfhCount}
                            </div>
                        </div>
                    </>
                }
            </NitroCardContentView>
        </NitroCardView>
    );
}
