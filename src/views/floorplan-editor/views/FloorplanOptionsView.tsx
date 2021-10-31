import { FC } from 'react';
import { NitroCardGridItemView, NitroCardGridView } from '../../../layout';
import { useFloorplanEditorContext } from '../context/FloorplanEditorContext';

export const FloorplanOptionsView: FC<{}> = props =>
{
    const { floorplanSettings = null, setFloorplanSettings = null } = useFloorplanEditorContext();
    
    return (
        <>
        <NitroCardGridView columns={5}>
            <NitroCardGridItemView className="set-tile" />
            <NitroCardGridItemView className="unset-tile" />
            <NitroCardGridItemView className="increase-height" />
            <NitroCardGridItemView className="decrease-height" />
            <NitroCardGridItemView className="set-door" />
        </NitroCardGridView>
        </>
    );
}
