pragma solidity ^0.5.11;

contract mapInfo {

    struct position
    {
        uint32 x;
        uint32 y;
    }

    struct city
    {
        bool capital;
        uint32 hp;
        string name;
        position p;
        bool fortress;
        uint32 numberOfsoldiers;
    }

    bool[100][] internal mapArray;

    constructor() internal {
        bool[100] memory forInitilization;
        for(uint32 i = 0 ; i < 100 ; i ++)
        {
            forInitilization[i] = false;
        }

        for(uint32 i = 0 ; i < 100 ; i ++)
        {
            mapArray.push(forInitilization);
        }
    }

    function selectCity() internal view returns (uint32 a, uint32 b)
    {
        for(uint32 i = 0 ; i < 100 ; i ++)
        {
            for(uint32 j = 0 ; j < 100 ; j ++)
            {
                if(!mapArray[i][j]) return (i, j);
            }
        }

        return (100, 100);
    }
}