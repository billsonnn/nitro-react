import { FC } from 'react';
import { Column, Flex, Text } from '..';
import { LocalizeText } from '../../api';
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
        <Flex overflow="hidden" className="nitro-gift-card text-black">
            <div className="d-flex align-items-center justify-content-center gift-face flex-shrink-0">
                { !userName && <div className="gift-incognito"></div> }
                { figure && <div className="gift-avatar">
                    <LayoutAvatarImageView figure={ figure } direction={ 2 } headOnly={ true } />
                </div> }
            </div>
            <Flex overflow="hidden" className="w-100 pt-4 pb-4 pe-4 ps-3">
                <Column grow overflow="auto" justifyContent="between">
                    { !editable &&
                        <Text textBreak className="gift-message">{ message }</Text> }
                    { editable && (onChange !== null) &&
                        <textarea className="gift-message h-100" maxLength={ 140 } value={ message } onChange={ (e) => onChange(e.target.value) } placeholder={ LocalizeText('catalog.gift_wrapping_new.message_hint') }></textarea> }
                    { userName &&
                        <Text italics textEnd className="pe-1">{ LocalizeText('catalog.gift_wrapping_new.message_from', [ 'name' ], [ userName ]) }</Text> }
                </Column>
            </Flex>
        </Flex>
    );
};
