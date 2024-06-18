import { AddLinkEventTracker, AvatarEditorFigureCategory, GetSessionDataManager, ILinkEventTracker, RemoveLinkEventTracker, UserFigureComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FaDice, FaRedo, FaTrash } from 'react-icons/fa';
import { AvatarEditorAction, LocalizeText, SendMessageComposer } from '../../api';
import { Button, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../common';
import { useAvatarEditor } from '../../hooks';
import { AvatarEditorFigurePreviewView } from './AvatarEditorFigurePreviewView';
import { AvatarEditorModelView } from './AvatarEditorModelView';
import { AvatarEditorWardrobeView } from './AvatarEditorWardrobeView';

const DEFAULT_MALE_FIGURE: string = 'hr-100.hd-180-7.ch-215-66.lg-270-79.sh-305-62.ha-1002-70.wa-2007';
const DEFAULT_FEMALE_FIGURE: string = 'hr-515-33.hd-600-1.ch-635-70.lg-716-66-62.sh-735-68';

export const AvatarEditorView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false);
    const { setIsVisible: setEditorVisibility, avatarModels, activeModelKey, setActiveModelKey, loadAvatarData, getFigureStringWithFace, gender, figureSetIds = [], randomizeCurrentFigure = null, getFigureString = null } = useAvatarEditor();

    const processAction = (action: string) =>
    {
        switch(action)
        {
            case AvatarEditorAction.ACTION_RESET:
                loadAvatarData(GetSessionDataManager().figure, GetSessionDataManager().gender);
                return;
            case AvatarEditorAction.ACTION_CLEAR:
                loadAvatarData(getFigureStringWithFace(0, false), gender);
                return;
            case AvatarEditorAction.ACTION_RANDOMIZE:
                randomizeCurrentFigure();
                return;
            case AvatarEditorAction.ACTION_SAVE:
                SendMessageComposer(new UserFigureComposer(gender, getFigureString));
                setIsVisible(false);
                return;
        }
    };

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'avatar-editor/'
        };

        AddLinkEventTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    useEffect(() =>
    {
        setEditorVisibility(isVisible);
    }, [ isVisible, setEditorVisibility ]);

    if(!isVisible) return null;

    return (
        <NitroCardView className="w-[620px] h-[374px] nitro-avatar-editor" uniqueKey="avatar-editor">
            <NitroCardHeaderView headerText={ LocalizeText('avatareditor.title') } onCloseClick={ event => setIsVisible(false) } />
            <NitroCardTabsView>
                { Object.keys(avatarModels).map(modelKey =>
                {
                    const isActive = (activeModelKey === modelKey);

                    return (
                        <NitroCardTabsItemView key={ modelKey } isActive={ isActive } onClick={ event => setActiveModelKey(modelKey) }>
                            { LocalizeText(`avatareditor.category.${ modelKey }`) }
                        </NitroCardTabsItemView>
                    );
                }) }
            </NitroCardTabsView>
            <NitroCardContentView>
                <Grid className="grid gap-2 overflow-hidden">
                    <div className="flex flex-col col-span-9 overflow-hidden">
                        { ((activeModelKey.length > 0) && (activeModelKey !== AvatarEditorFigureCategory.WARDROBE)) &&
                            <AvatarEditorModelView categories={ avatarModels[activeModelKey] } name={ activeModelKey } /> }
                        { (activeModelKey === AvatarEditorFigureCategory.WARDROBE) &&
                            <AvatarEditorWardrobeView /> }
                    </div>
                    <div className="flex flex-col col-span-3 overflow-hidden gap-1">
                        <AvatarEditorFigurePreviewView />
                        <div className="flex flex-col !flex-grow gap-1">
                            <div className="relative inline-flex align-middle">
                                <Button className="flex-auto " variant="secondary" onClick={ event => processAction(AvatarEditorAction.ACTION_RESET) }>
                                    <FaRedo className="fa-icon" />
                                </Button>
                                <Button className="flex-auto" variant="secondary" onClick={ event => processAction(AvatarEditorAction.ACTION_CLEAR) }>
                                    <FaTrash className="fa-icon" />
                                </Button>
                                <Button className="flex-auto" variant="secondary" onClick={ event => processAction(AvatarEditorAction.ACTION_RANDOMIZE) }>
                                    <FaDice className="fa-icon" />
                                </Button>
                            </div>
                            <Button className="w-full" variant="success" onClick={ event => processAction(AvatarEditorAction.ACTION_SAVE) }>
                                { LocalizeText('avatareditor.save') }
                            </Button>
                        </div>
                    </div>
                </Grid>
            </NitroCardContentView>
        </NitroCardView>
    );
};
