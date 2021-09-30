import { FC } from 'react';
import { LocalizeText } from '../../../../api';
import { NitroLayoutButton, NitroLayoutButtonGroup, NitroLayoutFlexColumn } from '../../../../layout';
import { AvatarEditorAction } from '../../common/AvatarEditorAction';
import { AvatarEditorFigureActionsViewProps } from './AvatarEditorFigureActionsView.types';

export const AvatarEditorFigureActionsView: FC<AvatarEditorFigureActionsViewProps> = props =>
{
    const { processAction = null } = props;

    return (
        <NitroLayoutFlexColumn className="flex-grow-1" gap={ 2 }>
            <NitroLayoutButtonGroup>
                <NitroLayoutButton variant="secondary" size="sm" onClick={ event => processAction(AvatarEditorAction.ACTION_RESET) }>
                    <i className="fas fa-undo" />
                </NitroLayoutButton>
                <NitroLayoutButton variant="secondary" size="sm" onClick={ event => processAction(AvatarEditorAction.ACTION_CLEAR) }>
                    <i className="fas fa-trash" />
                </NitroLayoutButton>
                <NitroLayoutButton variant="secondary" size="sm" onClick={ event => processAction(AvatarEditorAction.ACTION_RANDOMIZE) }>
                    <i className="fas fa-dice" />
                </NitroLayoutButton>
            </NitroLayoutButtonGroup>
            <NitroLayoutButton className="w-100" variant="success" size="sm" onClick={ event => processAction(AvatarEditorAction.ACTION_SAVE) }>
                { LocalizeText('avatareditor.save') }
            </NitroLayoutButton>
        </NitroLayoutFlexColumn>
    )
}
