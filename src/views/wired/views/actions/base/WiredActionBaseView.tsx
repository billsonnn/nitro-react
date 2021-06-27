import { ConditionDefinition, TriggerDefinition, WiredActionDefinition } from 'nitro-renderer';
import { FC, useCallback } from 'react';
import { WiredActionLayout } from '../../../utils/WiredActionLayout';
import { WiredActionToggleFurniStateView } from '../toggle-furni-state/WiredActionToggleFurniStateView';

export const WiredActionBaseView: FC<{ wiredDefinition: TriggerDefinition | WiredActionDefinition | ConditionDefinition }> = props =>
{
    const { wiredDefinition = null } = props;

    const getActionlayout = useCallback((code: number) =>
    {
        switch(code)
        {
            case WiredActionLayout.TOGGLE_FURNI_STATE:
                return <WiredActionToggleFurniStateView wiredDefinition={ wiredDefinition } />;
            default:
                return null;
        }
    }, [ wiredDefinition ]);
    
    return (
        <>
            { wiredDefinition && getActionlayout(wiredDefinition.code) }
        </>
    );
}
