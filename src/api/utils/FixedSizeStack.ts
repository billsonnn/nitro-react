export class FixedSizeStack
{
    private _data: number[];
    private _maxSize: number;
    private _index: number;

    constructor(k: number)
    {
        this._data = [];
        this._maxSize = k;
        this._index = 0;
    }

    public reset(): void
    {
        this._data = [];
        this._index = 0;
    }

    public addValue(k: number): void
    {
        if(this._data.length < this._maxSize)
        {
            this._data.push(k);
        }
        else
        {
            this._data[this._index] = k;
        }

        this._index = ((this._index + 1) % this._maxSize);
    }

    public getMax(): number
    {
        let k = Number.MIN_VALUE;

        let _local_2 = 0;

        while(_local_2 < this._maxSize)
        {
            if(this._data[_local_2] > k) k = this._data[_local_2];

            _local_2++;
        }

        return k;
    }

    public getMin(): number
    {
        let k = Number.MAX_VALUE;

        let _local_2 = 0;

        while(_local_2 < this._maxSize)
        {
            if(this._data[_local_2] < k) k = this._data[_local_2];

            _local_2++;
        }

        return k;
    }
}
