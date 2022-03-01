import { BotCommandConfigurationEvent, BotRemoveComposer, BotSkillSaveComposer, RequestBotCommandConfigurationComposer, RoomObjectCategory, RoomObjectType } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useState } from 'react';
import { GetNitroInstance, LocalizeText, RoomWidgetUpdateInfostandRentableBotEvent, RoomWidgetUpdateRentableBotChatEvent } from '../../../../api';
import { Button, Column, Flex, Text } from '../../../../common';
import { CreateMessageHook, SendMessageHook } from '../../../../hooks/messages';
import { useRoomContext } from '../../context/RoomContext';
import { ContextMenuHeaderView } from '../context-menu/ContextMenuHeaderView';
import { ContextMenuListItemView } from '../context-menu/ContextMenuListItemView';
import { ContextMenuView } from '../context-menu/ContextMenuView';
import { BotSkillsEnum } from './common/BotSkillsEnum';

interface AvatarInfoWidgetRentableBotViewProps
{
    rentableBotData: RoomWidgetUpdateInfostandRentableBotEvent;
    close: () => void;
}

const MODE_NORMAL = 0;
const MODE_CHANGE_NAME = 1;
const MODE_CHANGE_MOTTO = 2;

export const AvatarInfoWidgetRentableBotView: FC<AvatarInfoWidgetRentableBotViewProps> = props =>
{
    const { rentableBotData = null, close = null } = props;
    const [ mode, setMode ] = useState(MODE_NORMAL);
    const [ newName, setNewName ] = useState('');
    const [ newMotto, setNewMotto ] = useState('');
    const { eventDispatcher = null } = useRoomContext();

    const onBotCommandConfigurationEvent = useCallback((event: BotCommandConfigurationEvent) =>
    {
        const parser = event.getParser();

        if(parser.botId !== rentableBotData.webID) return;

        switch(parser.commandId)
        {
            case BotSkillsEnum.CHANGE_BOT_NAME:
                setNewName(parser.data);
                setMode(MODE_CHANGE_NAME);
                return;
            case BotSkillsEnum.CHANGE_BOT_MOTTO:
                setNewMotto(parser.data);
                setMode(MODE_CHANGE_MOTTO);
                return;
            case BotSkillsEnum.SETUP_CHAT: {
                const data = parser.data;
                const pieces = data.split(((data.indexOf(';#;') === -1) ? ';' : ';#;'));

                if((pieces.length === 3) || (pieces.length === 4))
                {
                    eventDispatcher.dispatchEvent(new RoomWidgetUpdateRentableBotChatEvent(
                        rentableBotData.roomIndex,
                        RoomObjectCategory.UNIT,
                        rentableBotData.webID,
                        pieces[0],
                        ((pieces[1].toLowerCase() === 'true') || (pieces[1] === '1')),
                        parseInt(pieces[2]),
                        ((pieces[3]) ? ((pieces[3].toLowerCase() === 'true') || (pieces[3] === '1')) : false)));

                    close();
                }

                return;
            }
        }
    }, [ rentableBotData, eventDispatcher, close ]);

    CreateMessageHook(BotCommandConfigurationEvent, onBotCommandConfigurationEvent);

    const requestBotCommandConfiguration = (skillType: number) => SendMessageHook(new RequestBotCommandConfigurationComposer(rentableBotData.webID, skillType));

    const processAction = (name: string) =>
    {
        let hideMenu = true;

        if(name)
        {
            switch(name)
            {
                case 'donate_to_all':
                    requestBotCommandConfiguration(BotSkillsEnum.DONATE_TO_ALL);
                    SendMessageHook(new BotSkillSaveComposer(rentableBotData.webID, BotSkillsEnum.DONATE_TO_ALL, ''));
                    break;
                case 'donate_to_user':
                    requestBotCommandConfiguration(BotSkillsEnum.DONATE_TO_USER);
                    SendMessageHook(new BotSkillSaveComposer(rentableBotData.webID, BotSkillsEnum.DONATE_TO_USER, ''));
                    break;
                case 'change_bot_name':
                    requestBotCommandConfiguration(BotSkillsEnum.CHANGE_BOT_NAME);
                    hideMenu = false;
                    break;
                case 'save_bot_name':
                    SendMessageHook(new BotSkillSaveComposer(rentableBotData.webID, BotSkillsEnum.CHANGE_BOT_NAME, newName));
                    break;
                case 'change_bot_motto':
                    requestBotCommandConfiguration(BotSkillsEnum.CHANGE_BOT_MOTTO);
                    hideMenu = false;
                    break;
                case 'save_bot_motto':
                    SendMessageHook(new BotSkillSaveComposer(rentableBotData.webID, BotSkillsEnum.CHANGE_BOT_MOTTO, newMotto));
                    break;
                case 'dress_up':
                    SendMessageHook(new BotSkillSaveComposer(rentableBotData.webID, BotSkillsEnum.DRESS_UP, ''));
                    break;
                case 'random_walk':
                    SendMessageHook(new BotSkillSaveComposer(rentableBotData.webID, BotSkillsEnum.RANDOM_WALK, ''));
                    break;
                case 'setup_chat':
                    requestBotCommandConfiguration(BotSkillsEnum.SETUP_CHAT);
                    hideMenu = false;
                    break;
                case 'dance':
                    SendMessageHook(new BotSkillSaveComposer(rentableBotData.webID, BotSkillsEnum.DANCE, ''));
                    break;
                case 'nux_take_tour':
                    GetNitroInstance().createLinkEvent('help/tour');
                    SendMessageHook(new BotSkillSaveComposer(rentableBotData.webID, BotSkillsEnum.NUX_TAKE_TOUR, ''));
                    break;
                case 'pick':
                    SendMessageHook(new BotRemoveComposer(rentableBotData.webID));
                    break;
                default:
                    break;
            }
        }

        if(hideMenu) close();
    }

    useEffect(() =>
    {
        setMode(MODE_NORMAL);
    }, [ rentableBotData ]);

    const canControl = (rentableBotData.amIOwner || rentableBotData.amIAnyRoomController);

    return (
        <ContextMenuView objectId={ rentableBotData.roomIndex } category={ RoomObjectCategory.UNIT } userType={ RoomObjectType.RENTABLE_BOT } close={ close }>
            <ContextMenuHeaderView>
                { rentableBotData.name }
            </ContextMenuHeaderView>
            { (mode === MODE_NORMAL) && canControl &&
                <>
                    { (rentableBotData.botSkills.indexOf(BotSkillsEnum.DONATE_TO_ALL) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('donate_to_all') }>
                            { LocalizeText('avatar.widget.donate_to_all') }
                        </ContextMenuListItemView> }
                    { (rentableBotData.botSkills.indexOf(BotSkillsEnum.DONATE_TO_USER) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('donate_to_user') }>
                            { LocalizeText('avatar.widget.donate_to_user') }
                        </ContextMenuListItemView> }
                    { (rentableBotData.botSkills.indexOf(BotSkillsEnum.CHANGE_BOT_NAME) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('change_bot_name') }>
                            { LocalizeText('avatar.widget.change_bot_name') }
                        </ContextMenuListItemView> }
                    { (rentableBotData.botSkills.indexOf(BotSkillsEnum.CHANGE_BOT_MOTTO) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('change_bot_motto') }>
                            { LocalizeText('avatar.widget.change_bot_motto') }
                        </ContextMenuListItemView> }
                    { (rentableBotData.botSkills.indexOf(BotSkillsEnum.DRESS_UP) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('dress_up') }>
                            { LocalizeText('avatar.widget.dress_up') }
                        </ContextMenuListItemView> }
                    { (rentableBotData.botSkills.indexOf(BotSkillsEnum.RANDOM_WALK) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('random_walk') }>
                            { LocalizeText('avatar.widget.random_walk') }
                        </ContextMenuListItemView> }
                    { (rentableBotData.botSkills.indexOf(BotSkillsEnum.SETUP_CHAT) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('setup_chat') }>
                            { LocalizeText('avatar.widget.setup_chat') }
                        </ContextMenuListItemView> }
                    { (rentableBotData.botSkills.indexOf(BotSkillsEnum.DANCE) >= 0) &&
                        <ContextMenuListItemView onClick={ event => processAction('dance') }>
                            { LocalizeText('avatar.widget.dance') }
                        </ContextMenuListItemView> }
                    { (rentableBotData.botSkills.indexOf(BotSkillsEnum.NO_PICK_UP) === -1) &&
                        <ContextMenuListItemView onClick={ event => processAction('pick') }>
                            { LocalizeText('avatar.widget.pick_up') }
                        </ContextMenuListItemView> }
                </> }
            { (mode === MODE_CHANGE_NAME) &&
                <Column className="menu-item" onClick={ null } gap={ 1 }>
                    <Text variant="white">{ LocalizeText('bot.skill.name.configuration.new.name') }</Text>
                    <input type="text" className="form-control form-control-sm" value={ newName } onChange={ event => setNewName(event.target.value) } />
                    <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                        <Button fullWidth variant="secondary" onClick={ event => processAction(null) }>{ LocalizeText('cancel') }</Button>
                        <Button fullWidth variant="success" onClick={ event => processAction('save_bot_name') }>{ LocalizeText('save') }</Button>
                    </Flex>
                </Column> }
            { (mode === MODE_CHANGE_MOTTO) &&
                <Column className="menu-item" onClick={ null } gap={ 1 }>
                    <Text variant="white">{ LocalizeText('bot.skill.name.configuration.new.motto') }</Text>
                    <input type="text" className="form-control form-control-sm" value={ newMotto } onChange={ event => setNewMotto(event.target.value) } />
                    <Flex alignItems="center" justifyContent="between" gap={ 1 }>
                        <Button fullWidth variant="secondary" onClick={ event => processAction(null) }>{ LocalizeText('cancel') }</Button>
                        <Button fullWidth variant="success" onClick={ event => processAction('save_bot_motto') }>{ LocalizeText('save') }</Button>
                    </Flex>
                </Column> }
        </ContextMenuView>
    );
}
