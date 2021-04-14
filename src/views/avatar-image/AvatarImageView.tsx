import { AdvancedMap } from 'nitro-renderer';
import { AvatarScaleType } from 'nitro-renderer/src/nitro/avatar/enum/AvatarScaleType';
import { AvatarSetType } from 'nitro-renderer/src/nitro/avatar/enum/AvatarSetType';
import { IAvatarImageListener } from 'nitro-renderer/src/nitro/avatar/IAvatarImageListener';
import { Nitro } from 'nitro-renderer/src/nitro/Nitro';
import { Component } from 'react';
import { AvatarImageViewProps, AvatarImageViewState } from './AvatarImageView.types';

export class AvatarImageView extends Component<AvatarImageViewProps, AvatarImageViewState> implements IAvatarImageListener
{
    private static _maxAvatarCacheSize = 10;
    private static _avatarCache: AdvancedMap<string, string> = new AdvancedMap();

    private static defaultProps: AvatarImageViewProps = {
        figure: '',
        gender: 'M',
        headOnly: false,
        direction: 0,
        scale: 1
    };

    constructor(props: AvatarImageViewProps)
    {;
        super(props);

        this.state = {
            avatarUrl: null
        };
    }

    public dispose(): void
    {

    }

    public componentDidMount(): void
    {
        this.buildAvatar();
    }

    private buildAvatar(): void
    {
        const imageUrl = this.getUserImageUrl();

        if(imageUrl && imageUrl.length) this.setState({ avatarUrl: imageUrl });
    }

    private getUserImageUrl(): string
    {
        const build = this.getAvatarBuildString();

        let existing = AvatarImageView._avatarCache.getValue(build);

        if(!existing)
        {
            const avatarImage = Nitro.instance.avatar.createAvatarImage(this.props.figure, AvatarScaleType.LARGE, this.props.gender, this, null);

            if(avatarImage)
            {
                let setType = AvatarSetType.FULL;

                if(this.props.headOnly) setType = AvatarSetType.HEAD;

                avatarImage.setDirection(setType, this.props.direction);

                const image = avatarImage.getCroppedImage(setType);

                if(image) existing = image.src;

                avatarImage.dispose();
            }

            if(existing) this.putInCache(build, existing);
        }

        return existing;
    }

    public resetFigure(figure: string): void
    {
        AvatarImageView._avatarCache.remove(this.getAvatarBuildString());

        this.buildAvatar();
    }

    public getAvatarBuildString(): string
    {
        return (`${ this.props.figure }:${ this.props.gender }:${ this.props.direction }:${ this.props.headOnly }`);
    }

    private putInCache(build: string, url: string): void
    {
        if(AvatarImageView._avatarCache.length === AvatarImageView._maxAvatarCacheSize) AvatarImageView._avatarCache.remove(AvatarImageView._avatarCache.getKey(0));

        AvatarImageView._avatarCache.add(build, url);
    }

    public render(): JSX.Element
    {
        const url = `url('${ this.state.avatarUrl }')`;
        
        return (
            <div className="avatar-image" style={ (url && url.length) ? { backgroundImage: url } : {} }></div>
        );
    }

    public get disposed(): boolean
    {
        return false;
    }
}
