import { IAvatarFigureContainer, SaveWardrobeOutfitMessageComposer } from "@nitrots/nitro-renderer"
import { Dispatch, FC, SetStateAction, useCallback, useMemo } from "react"
import { FigureData, GetAvatarRenderManager, GetClubMemberLevel, GetConfiguration, LocalizeText, SendMessageComposer } from "../../../api"
import { Button, LayoutAvatarImageView } from "../../../common"

export interface AvatarEditorWardrobeViewProps
{
    figureData: FigureData;
    savedFigures: [ IAvatarFigureContainer, string ][];
    setSavedFigures: Dispatch<SetStateAction<[ IAvatarFigureContainer, string][]>>;
    loadAvatarInEditor: (figure: string, gender: string, reset?: boolean) => void;
}

export const AvatarEditorWardrobeView: FC<AvatarEditorWardrobeViewProps> = props =>
{
    const { figureData = null, savedFigures = [], setSavedFigures = null, loadAvatarInEditor = null } = props

    const hcDisabled = GetConfiguration<boolean>("hc.disabled", false)

    const wearFigureAtIndex = useCallback((index: number) =>
    {
        if((index >= savedFigures.length) || (index < 0)) return

        const [ figure, gender ] = savedFigures[index]

        loadAvatarInEditor(figure.getFigureString(), gender)
    }, [ savedFigures, loadAvatarInEditor ])

    const saveFigureAtWardrobeIndex = useCallback((index: number) =>
    {
        if(!figureData || (index >= savedFigures.length) || (index < 0)) return

        const newFigures = [ ...savedFigures ]

        const figure = figureData.getFigureString()
        const gender = figureData.gender

        newFigures[index] = [ GetAvatarRenderManager().createFigureContainer(figure), gender ]

        setSavedFigures(newFigures)
        SendMessageComposer(new SaveWardrobeOutfitMessageComposer((index + 1), figure, gender))
    }, [ figureData, savedFigures, setSavedFigures ])

    const figures = useMemo(() =>
    {
        if(!savedFigures || !savedFigures.length) return []

        const items: JSX.Element[] = []

        savedFigures.forEach(([ figureContainer, gender ], index) =>
        {
            let clubLevel = 0

            if(figureContainer) clubLevel = GetAvatarRenderManager().getFigureClubLevel(figureContainer, gender)

            items.push(
                <div className="illumina-card-item relative flex h-[122px] flex-col justify-between overflow-hidden p-1.5">
                    <button className="flex h-20 items-center" onClick={ event => wearFigureAtIndex(index) } disabled={ (clubLevel > GetClubMemberLevel()) }>
                        <LayoutAvatarImageView className="wardrobe-avatar !w-full !bg-[center_0] [image-rendering:initial]" figure={ figureContainer?.getFigureString() } gender={ gender } direction={ 4 } scale={ 0.7 } />
                    </button>
                    { !hcDisabled && (clubLevel > 0) && <i className="absolute right-1 top-1 h-[9px] w-2.5 bg-[url('/client-assets/images/spritesheet.png?v=2451779')] dark:bg-[url('/client-assets/images/spritesheet-dark.png?v=2451779')] bg-[-298px_-69px]" /> }
                    <div className="flex flex-col">
                        <Button className="!h-[22px] !text-[10px]" onClick={ event => saveFigureAtWardrobeIndex(index) }>{ LocalizeText("avatareditor.wardrobe.save") }</Button>
                    </div>
                </div>
            )
        })

        return items
    }, [ savedFigures, hcDisabled, saveFigureAtWardrobeIndex, wearFigureAtIndex ])

    return (
        <div className="w-full">
            <div className="flex h-[42px] flex-col pt-1">
                <p className="pb-1 text-sm font-semibold !leading-3 [text-shadow:_0_1px_0_#fff] dark:[text-shadow:_0_1px_0_#33312B]">{ LocalizeText("avatareditor.wardrobe.title") }</p>
                <p className="text-xs">{ LocalizeText("avatareditor.hotlooks.choose") }</p>
            </div>
            <div className="illumina-previewer relative h-[275px] overflow-hidden p-3">
                <div className="grid grid-cols-5 gap-2">
                    { figures }
                </div>
            </div>
        </div>
    )
}
