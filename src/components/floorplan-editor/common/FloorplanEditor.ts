import { GetAssetManager, IGraphicAssetCollection, NitroPoint, NitroTilemap, PixiApplicationProxy, PixiInteractionEventProxy, POINT_STRUCT_SIZE } from '@nitrots/nitro-renderer';
import { ActionSettings } from './ActionSettings';
import { FloorAction, HEIGHT_SCHEME, MAX_NUM_TILE_PER_AXIS, TILE_SIZE } from './Constants';
import { Tile } from './Tile';
import { getScreenPositionForTile, getTileFromScreenPosition } from './Utils';

export class FloorplanEditor extends PixiApplicationProxy
{
    private static _INSTANCE: FloorplanEditor = null;

    private static readonly TILE_BLOCKED = 'r_blocked';
    private static readonly TILE_DOOR = 'r_door';

    private _tilemap: Tile[][];
    private _width: number;
    private _height: number;
    private _isHolding: boolean;
    private _doorLocation: NitroPoint;
    private _lastUsedTile: NitroPoint;
    private _tilemapRenderer: NitroTilemap;
    private _actionSettings: ActionSettings;
    private _isInitialized: boolean;

    private _assetCollection: IGraphicAssetCollection;

    constructor()
    {
        const width = TILE_SIZE * MAX_NUM_TILE_PER_AXIS + 20;
        const height = (TILE_SIZE * MAX_NUM_TILE_PER_AXIS) / 2 + 100;

        super({
            width: width,
            height: height,
            backgroundColor: 0x000000,
            antialias: true,
            autoDensity: true,
            resolution: 1,
            sharedLoader: true,
            sharedTicker: true
        });

        this._tilemap = [];
        this._doorLocation = new NitroPoint(0, 0);
        this._width = 0;
        this._height = 0;
        this._isHolding = false;
        this._lastUsedTile = new NitroPoint(-1, -1);
        this._actionSettings = new ActionSettings();
    }

    public initialize(): void
    {
        if(this._isInitialized) return;

        const collection = GetAssetManager().getCollection('floor_editor');

        if(!collection) return;

        this._assetCollection = collection;
        this._tilemapRenderer = new NitroTilemap(collection.baseTexture);

        this.registerEventListeners();

        this.stage.addChild(this._tilemapRenderer);
        
        this._isInitialized = true;
    }

    private registerEventListeners(): void
    {
        //this._tilemapRenderer.interactive = true;

        const tempPoint = new NitroPoint();
        // @ts-ignore
        this._tilemapRenderer.containsPoint = (position) =>
        {
            this._tilemapRenderer.worldTransform.applyInverse(position, tempPoint);
            return this.tileHitDetection(tempPoint, false);
        };

        this._tilemapRenderer.on('pointerup', () =>
        {
            this._isHolding = false;
        });

        this._tilemapRenderer.on('pointerout', () =>
        {
            this._isHolding = false;
        });

        this._tilemapRenderer.on('pointerdown', (event: PixiInteractionEventProxy) =>
        {
            if(!(event.data.originalEvent instanceof PointerEvent) && !(event.data.originalEvent instanceof TouchEvent)) return;

            const pointerEvent = event.data.originalEvent;
            if((pointerEvent instanceof MouseEvent) && pointerEvent.button === 2) return;


            const location = event.data.global;
            this.tileHitDetection(location, true);
        });

        this._tilemapRenderer.on('click', (event: PixiInteractionEventProxy) =>
        {
            if(!(event.data.originalEvent instanceof PointerEvent)) return;

            const pointerEvent = event.data.originalEvent;
            if(pointerEvent.button === 2) return;

            const location = event.data.global;
            this.tileHitDetection(location, true, true);
        });
    }

    private tileHitDetection(tempPoint: NitroPoint, setHolding: boolean, isClick: boolean = false): boolean
    {
        // @ts-ignore
        const buffer = this._tilemapRenderer.pointsBuf;
        const bufSize = POINT_STRUCT_SIZE;

        const len = buffer.length;

        if(setHolding)
        {
            this._isHolding = true;
        }

        for(let j = 0; j < len; j += bufSize)
        {
            const bufIndex = j + bufSize;
            const data = buffer.slice(j, bufIndex);

            const width = TILE_SIZE;
            const height = TILE_SIZE / 2;

            const mousePositionX = Math.floor(tempPoint.x);
            const mousePositionY = Math.floor(tempPoint.y);

            const tileStartX = data[2];
            const tileStartY = data[3];

            const centreX = tileStartX + (width / 2);
            const centreY = tileStartY + (height / 2);

            const dx = Math.abs(mousePositionX - centreX);
            const dy = Math.abs(mousePositionY - centreY);

            const solution = (dx / (width * 0.5) + dy / (height * 0.5) <= 1);//todo: improve this
            if(solution)
            {
                if(this._isHolding)
                {
                    const [ realX, realY ] = getTileFromScreenPosition(tileStartX, tileStartY);

                    if(isClick)
                    {
                        this.onClick(realX, realY);
                    }
                    
                    else if(this._lastUsedTile.x !== realX || this._lastUsedTile.y !== realY)
                    {
                        this._lastUsedTile.x = realX;
                        this._lastUsedTile.y = realY;
                        this.onClick(realX, realY);
                    }
                    
                }
                return true;
            }

        }
        return false;
    }

    private onClick(x: number, y: number): void
    {
        const tile = this._tilemap[y][x];
        const heightIndex = HEIGHT_SCHEME.indexOf(tile.height);

        let futureHeightIndex = 0;

        switch(this._actionSettings.currentAction)
        {
            case FloorAction.DOOR:

                if(tile.height !== 'x')
                {
                    this._doorLocation.x = x;
                    this._doorLocation.y = y;
                    this.renderTiles();
                }
                return;
            case FloorAction.UP:
                if(tile.height === 'x') return;
                futureHeightIndex = heightIndex + 1;
                break;
            case FloorAction.DOWN:
                if(tile.height === 'x' || (heightIndex <= 1)) return;
                futureHeightIndex = heightIndex - 1;
                break;
            case FloorAction.SET:
                futureHeightIndex = HEIGHT_SCHEME.indexOf(this._actionSettings.currentHeight);
                break;
            case FloorAction.UNSET:
                futureHeightIndex = 0;
                break;
        }

        if(futureHeightIndex === -1) return;

        if(heightIndex === futureHeightIndex) return;

        if(futureHeightIndex > 0)
        {
            if((x + 1) > this._width) this._width = x + 1;

            if((y + 1) > this._height) this._height = y + 1;
        }

        const newHeight = HEIGHT_SCHEME[futureHeightIndex];

        if(!newHeight) return;

        if(tile.isBlocked) return;

        this._tilemap[y][x].height = newHeight;

        this.renderTiles();
    }

    public renderTiles(): void
    {
        this.tilemapRenderer.clear();

        for(let y = 0; y < this._tilemap.length; y++)
        {
            for(let x = 0; x < this.tilemap[y].length; x++)
            {
                const tile = this.tilemap[y][x];
                let assetName = tile.height;

                if(this._doorLocation.x === x && this._doorLocation.y === y)
                    assetName = FloorplanEditor.TILE_DOOR;

                if(tile.isBlocked) assetName = FloorplanEditor.TILE_BLOCKED;

                //if((tile.height === 'x') || tile.height === 'X') continue;
                const [ positionX, positionY ] = getScreenPositionForTile(x, y);
                
                this._tilemapRenderer.tile(this._assetCollection.getTexture(`floor_editor_${ assetName }`), positionX, positionY);
            }
        }
    }

    public setTilemap(map: string, blockedTiles: boolean[][]): void
    {
        this._tilemap = [];
        const roomMapStringSplit = map.split('\r');

        let width = 0;
        let height = roomMapStringSplit.length;

        // find the map width, height
        for(let y = 0; y < height; y++)
        {
            const originalRow = roomMapStringSplit[y];

            if(originalRow.length === 0)
            {
                roomMapStringSplit.splice(y, 1);
                height = roomMapStringSplit.length;
                y--;
                continue;
            }

            if(originalRow.length > width)
            {
                width = originalRow.length;
            }
        }
        // fill map with room heightmap tiles
        for(let y = 0; y < height; y++)
        {
            this._tilemap[y] = [];
            const rowString = roomMapStringSplit[y];

            for(let x = 0; x < width; x++)
            {
                const blocked = (blockedTiles[y] && blockedTiles[y][x]) || false;

                const char = rowString[x];
                if(((!(char === 'x')) && (!(char === 'X')) && char))
                {
                    this._tilemap[y][x] = new Tile(char, blocked);
                }
                else
                {
                    this._tilemap[y][x] = new Tile('x', blocked);
                }
            }

            for(let x = width; x < MAX_NUM_TILE_PER_AXIS; x++)
            {
                this.tilemap[y][x] = new Tile('x', false);
            }
        }

        // fill remaining map with empty tiles
        for(let y = height; y < MAX_NUM_TILE_PER_AXIS; y++)
        {
            if(!this.tilemap[y]) this.tilemap[y] = [];
            for(let x = 0; x < MAX_NUM_TILE_PER_AXIS; x++)
            {
                this.tilemap[y][x] = new Tile('x', false);
            }
        }

        this._width = width;
        this._height = height;
    }

    public getCurrentTilemapString(): string
    {
        const highestTile = this._tilemap[this._height - 1][this._width - 1];

        if(highestTile.height === 'x')
        {
            this._width = -1;
            this._height = -1;

            for(let y = MAX_NUM_TILE_PER_AXIS - 1; y >= 0; y--)
            {
                if(!this._tilemap[y]) continue;

                for(let x = MAX_NUM_TILE_PER_AXIS - 1; x >= 0; x--)
                {
                    if(!this._tilemap[y][x]) continue;

                    const tile = this._tilemap[y][x];

                    if(tile.height !== 'x')
                    {
                        if((x + 1) > this._width)
                            this._width = x + 1;

                        if((y + 1) > this._height)
                            this._height = y + 1;
                    }
                }
            }
        }


        const rows = [];

        for(let y = 0; y < this._height; y++)
        {
            const row = [];

            for(let x = 0; x < this._width; x++)
            {
                const tile = this._tilemap[y][x];

                row[x] = tile.height;
            }

            rows[y] = row.join('');
        }

        return rows.join('\r');
    }

    public clear(): void
    {
        this._tilemapRenderer.interactive = false;
        this._tilemap = [];
        this._doorLocation.set(-1, -1);
        this._width = 0;
        this._height = 0;
        this._isHolding = false;
        this._lastUsedTile.set(-1, -1);
        this._actionSettings.clear();
        this._tilemapRenderer.clear();
    }

    public get tilemapRenderer(): NitroTilemap
    {
        return this._tilemapRenderer;
    }

    public get tilemap(): Tile[][]
    {
        return this._tilemap;
    }

    public get doorLocation(): NitroPoint
    {
        return this._doorLocation;
    }

    public set doorLocation(value: NitroPoint)
    {
        this._doorLocation = value;
    }

    public get actionSettings(): ActionSettings
    {
        return this._actionSettings;
    }

    public static get instance(): FloorplanEditor
    {
        if(!FloorplanEditor._INSTANCE)
        {
            FloorplanEditor._INSTANCE = new FloorplanEditor();
        }

        return FloorplanEditor._INSTANCE;
    }
}
