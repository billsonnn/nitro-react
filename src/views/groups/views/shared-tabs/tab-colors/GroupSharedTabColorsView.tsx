import classNames from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import { LocalizeText } from '../../../../../api';
import { useGroupsContext } from '../../../context/GroupsContext';
import { GroupsActions } from '../../../context/GroupsContext.types';

export const GroupSharedTabColorsView: FC<{}> = props =>
{
    const { groupsState = null, dispatchGroupsState = null } = useGroupsContext();
    const { groupColors = null, groupColorsA = null, groupColorsB = null } = groupsState;

    const [ selectingColorIndex, setSelectingColorIndex ] = useState<number>(0);

    useEffect(() =>
    {
        if(!groupColorsA || !groupColorsB || groupColors) return;

        const colors: number[] = [
            groupColorsA[0].id,
            groupColorsB[0].id
        ];

        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_COLORS,
            payload: {
                objectValues: colors
            }
        });
        
    }, [dispatchGroupsState, groupColors, groupColorsA, groupColorsB]);

    const getGroupColor = useCallback((colorIndex: number) =>
    {
        if(colorIndex === 0) return groupColorsA.find(c => c.id === groupColors[colorIndex]).color;

        return groupColorsB.find(c => c.id === groupColors[colorIndex]).color;
    }, [ groupColors, groupColorsA, groupColorsB ]);

    const selectColor = useCallback((colorId: number) =>
    {
        const clonedGroupColors = Array.from(groupColors);

        clonedGroupColors[selectingColorIndex] = colorId;

        dispatchGroupsState({
            type: GroupsActions.SET_GROUP_COLORS,
            payload: { 
                objectValues: clonedGroupColors
            }
        });
    }, [ selectingColorIndex, groupColors, dispatchGroupsState ]);
    
    return (
        <div className="shared-tab-colors d-flex flex-column gap-2">
            <div className="d-flex flex-column align-items-center">
                <div className="fw-bold">{ LocalizeText('group.edit.color.guild.color') }</div>
                { groupColors && <div className="d-flex rounded border overflow-hidden">
                    <div className="group-color-swatch" style={{ backgroundColor: '#' + getGroupColor(0) }}></div>
                    <div className="group-color-swatch" style={{ backgroundColor: '#' + getGroupColor(1) }}></div>
                </div> }
            </div>
            { selectingColorIndex === 0 && <div>
                <div className="fw-bold">{ LocalizeText('group.edit.color.primary.color') }</div>
                <div className="d-flex align-items-center gap-2">
                    <div className="row row-cols-18 g-0 gap-1 w-100 h-100 overflow-auto">
                        { groupColors && groupColorsA && groupColorsA.map((item, index) =>
                            {
                                return <div key={ index } className={ 'color-swatch cursor-pointer' + classNames({ ' active': groupColors[selectingColorIndex] === item.id }) } style={{ backgroundColor: '#' + item.color }} onClick={ () => selectColor(item.id) }></div>
                            }) }
                    </div>
                    <div><i className="fas fa-chevron-right h2 m-0 text-primary cursor-pointer" onClick={ () => setSelectingColorIndex(1) } /></div>
                </div>
            </div> }
            { selectingColorIndex === 1 && <div>
                <div className="fw-bold text-end">{ LocalizeText('group.edit.color.secondary.color') }</div>
                <div className="d-flex align-items-center gap-2">
                    <div><i className="fas fa-chevron-left h2 m-0 text-primary cursor-pointer" onClick={ () => setSelectingColorIndex(0) } /></div>
                    <div className="row row-cols-18 g-0 gap-1 w-100 h-100 overflow-auto">
                        { groupColorsB && groupColorsB.map((item, index) =>
                            {
                                return <div key={ index } className={ 'color-swatch cursor-pointer' + classNames({ ' active': groupColors[selectingColorIndex] === item.id }) } style={{ backgroundColor: '#' + item.color }} onClick={ () => selectColor(item.id) }></div>
                            }) }
                    </div>
                </div>
            </div> }
        </div>
    );
};
