import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { Button, Column, DraggableWindow, Flex, LayoutAvatarImageView, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useFurnitureFriendFurniWidget } from '../../../../hooks';

export const FurnitureFriendFurniView: FC<{}> = props =>
{
    const { objectId = -1, type = 0, stage = 0, usernames = [], figures = [], date = null, onClose = null, respond = null } = useFurnitureFriendFurniWidget();

    if(objectId === -1) return null;

    if(stage > 0)
    {
        return (
            <NitroCardView className="nitro-engraving-lock" theme="primary-slim">
                <NitroCardHeaderView headerText={ LocalizeText('friend.furniture.confirm.lock.caption') } onCloseClick={ onClose } />
                <NitroCardContentView>
                    <h5 className="text-black text-center fw-bold mt-2 mb-2">
                        { LocalizeText('friend.furniture.confirm.lock.subtitle') }
                    </h5>
                    <div className="d-flex justify-content-center mb-2">
                        <div className={ `engraving-lock-stage-${ stage }` }></div>
                    </div>
                    { (stage === 2) &&
                        <div className="text-small text-black text-center mb-2">{ LocalizeText('friend.furniture.confirm.lock.other.locked') }</div> }
                    <Flex gap={ 1 }>
                        <Button fullWidth onClick={ event => respond(false) }>{ LocalizeText('friend.furniture.confirm.lock.button.cancel') }</Button>
                        <Button fullWidth variant="success" onClick={ event => respond(true) }>{ LocalizeText('friend.furniture.confirm.lock.button.confirm') }</Button>
                    </Flex>
                </NitroCardContentView>
            </NitroCardView>
        );
    }

    if(usernames.length > 0)
    {
        return (
            <DraggableWindow handleSelector=".nitro-engraving-lock-view">
                <div className={ `nitro-engraving-lock-view engraving-lock-${ type }` }>
                    <div className="engraving-lock-close" onClick={ onClose } />
                    <Flex justifyContent="center">
                        <div className="engraving-lock-avatar">
                            <LayoutAvatarImageView figure={ figures[0] } direction={ 2 } />
                        </div>
                        <div className="engraving-lock-avatar">
                            <LayoutAvatarImageView figure={ figures[1] } direction={ 4 } />
                        </div>
                    </Flex>
                    <Column justifyContent="between" className="mt-1">
                        <Column alignItems="center" justifyContent="center" gap={ 1 }>
                            <div>
                                { (type === 0) && LocalizeText('lovelock.engraving.caption') }
                                { (type === 3) && LocalizeText('wildwest.engraving.caption') }
                            </div>
                            <div>{ date }</div>
                        </Column>
                        <Flex justifyContent="center" gap={ 4 }>
                            <div>{ usernames[0] }</div>
                            <div>{ usernames[1] }</div>
                        </Flex>
                    </Column>
                </div>
            </DraggableWindow>
        );
    }
}
