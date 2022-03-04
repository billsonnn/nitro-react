import { FC } from 'react';
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
        <div className="nitro-gift-card d-flex text-black">
            <div className="d-flex align-items-center justify-content-center gift-face flex-shrink-0">
                { !userName && <div className="gift-incognito"></div> }
                { figure && <div className="gift-avatar">
                    <LayoutAvatarImageView figure={ figure } direction={ 2 } headOnly={ true } />
                </div> }
            </div>
            <div className="d-flex flex-column w-100 pt-4 pb-4 pe-4 ps-3">
                { !editable && <div className="gift-message">{ message }</div> }
                { editable && onChange && <textarea className="gift-message" maxLength={ 140 } value={ message } onChange={ (e) => onChange(e.target.value) } placeholder={ LocalizeText('catalog.gift_wrapping_new.message_hint') }></textarea> }
                { userName && <div className="mt-auto text-end fst-italic">{ LocalizeText('catalog.gift_wrapping_new.message_from', ['name'], [userName]) }</div> }
            </div>
        </div>
    );
};
