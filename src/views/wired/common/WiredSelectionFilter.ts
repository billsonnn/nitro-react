import { ColorConverter, NitroFilter } from '@nitrots/nitro-renderer';

const vertex = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;
void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`;

const fragment = `
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 lineColor;
uniform vec3 color;
void main(void) {
    vec4 currentColor = texture2D(uSampler, vTextureCoord);
    vec3 colorLine = lineColor * currentColor.a;
    vec3 colorOverlay = color * currentColor.a;

    if(currentColor.r == 0.0 && currentColor.g == 0.0 && currentColor.b == 0.0 && currentColor.a > 0.0) {
        gl_FragColor = vec4(colorLine.r, colorLine.g, colorLine.b, currentColor.a);
    } else if(currentColor.a > 0.0) {
        gl_FragColor = vec4(colorOverlay.r, colorOverlay.g, colorOverlay.b, currentColor.a);
    }
}`;

export class WiredSelectionFilter extends NitroFilter
{
    private _lineColor: number;
    private _color: number;

    constructor(lineColor: number | number[], color: number | number[])
    {
        super(vertex, fragment);

        this.uniforms.lineColor = new Float32Array(3);
        this.uniforms.color     = new Float32Array(3);
        this.lineColor          = lineColor;
        this.color              = color;
    }

    public get lineColor(): number | number[]
    {
        return this._lineColor;
    }

    public set lineColor(value: number | number[])
    {
        const arr = this.uniforms.lineColor;

        if(typeof value === 'number')
        {
            ColorConverter.hex2rgb(value, arr);

            this._lineColor = value;
        }
        else
        {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];

            this._lineColor = ColorConverter.rgb2hex(arr);
        }
    }

    public get color(): number | number[]
    {
        return this._color;
    }

    public set color(value: number | number[])
    {
        const arr = this.uniforms.color;

        if(typeof value === 'number')
        {
            ColorConverter.hex2rgb(value, arr);

            this._color = value;
        }
        else
        {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];

            this._color = ColorConverter.rgb2hex(arr);
        }
    }
}
