import { FC } from 'react';
import { LocalizeText } from '../../api';
import { Column } from '../Column';
import { Flex } from '../Flex';
import { Text } from '../Text';
import { LayoutAvatarImageView } from './LayoutAvatarImageView';

interface LayoutGiftTagViewProps
{
    figure?: string;
    userName?: string;
    message?: string;
    editable?: boolean;
    onChange?: (value: string) => void;
}

export const LayoutGiftTagView: FC<LayoutGiftTagViewProps> = props =>
{
    const { figure = null, userName = null, message = null, editable = false, onChange = null } = props;

    return (
        <Flex className="nitro-gift-card text-black" overflow="hidden">
            <div className="flex items-center justify-center gift-face flex-shrink-0">
                { !userName && <div className="gift-incognito"></div> }
                { figure && <div className="gift-avatar">
                    <LayoutAvatarImageView direction={ 2 } figure={ figure } headOnly={ true } />
                </div> }
            </div>
            <Flex className="w-full pt-4 pb-4 pe-4 ps-3" overflow="hidden">
                <Column className="!flex-grow" justifyContent="between" overflow="auto">
                    { !editable &&
                        <Text textBreak className="gift-message">{ message }</Text> }
                    { editable && (onChange !== null) &&
                        <textarea className="gift-message h-full" maxLength={ 140 } placeholder={ LocalizeText('catalog.gift_wrapping_new.message_hint') } value={ message } onChange={ (e) => onChange(e.target.value) }></textarea> }
                    { userName &&
                        <Text italics textEnd className="pe-1">{ LocalizeText('catalog.gift_wrapping_new.message_from', [ 'name' ], [ userName ]) }</Text> }
                </Column>
            </Flex>
        </Flex>
    );
};
