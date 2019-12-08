pragma solidity ^0.5.11;

import "./mapdata.sol";

contract userStatus is mapInfo {

    struct userAccount
    {
        address ethereumAccount;
        string userID;
        string userPassword;
    }

    struct userData
    {
        userAccount account;
        bool survival;
        uint32 numberOfCity;
        city[] cities;
        uint32 money;
        uint32 taxTime;
    }

    uint32 internal numberOfuser = 0;
    userData[] internal users;
}