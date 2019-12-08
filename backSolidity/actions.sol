pragma solidity ^0.5.11;

import "./userdata.sol";

contract Acctions is userStatus {

    function findUserByUserID(string memory userID) internal view returns (uint256 result)
    {
        for(uint32 i = 0 ; i < users.length ; i++)
        {
            if(keccak256(abi.encodePacked((users[i].userID))) == keccak256(abi.encodePacked((userID)))) return i;
        }

        return users.length + 10;
    }


    function findCityByName(string memory userID, string memory name) internal view returns (uint256 result)
    {

        for(uint32 i = 0 ; i < mapArray.length ; i++)
        {
            bool ownerCheck = keccak256(abi.encodePacked((mapArray[i].owner))) == keccak256(abi.encodePacked((userID)));
            bool cityNameCheck = keccak256(abi.encodePacked((mapArray[i].name))) == keccak256(abi.encodePacked((name)));
            if(ownerCheck && cityNameCheck) return i;
        }

        return mapArray.length + 10;
    }

    function makeAccount(address ethereumAddress, string memory userID, string memory userPassword) public
    {
       require(findUserByUserID(userID) > users.length, "DUPLICATE USERID, USER ANOTHER ID");
       uint256 position = mapArray.length + 1;
       city memory newUserCapitalCity = city(userID, true, 100,  string(abi.encodePacked(userID)), position, false, 0);
       mapArray.push(newUserCapitalCity);
       userData memory newUser = userData(ethereumAddress, userID, userPassword, true, 0, now);
       users.push(newUser);
    }

    function login(string memory userID, string memory userPassword) public view
    {
        uint256 userIndex = findUserByUserID(userID);
        require(userIndex < users.length, "No Corresponding user, please SIGN UP");

        bool idCheck = keccak256(abi.encodePacked((users[userIndex].userID))) == keccak256(abi.encodePacked((userID)));
        bool passwordCheck = keccak256(abi.encodePacked((users[userIndex].userPassword))) == keccak256(abi.encodePacked((userPassword)));
        bool loginStatus = idCheck && passwordCheck;

        require(loginStatus, "Wrong ID or Password");
    }

    function produceSolider(string memory userID, string memory cityName, uint32 number) public
    {
       uint256 userIndex = findUserByUserID(userID);
       uint256 cityIndex = findCityByName(userID, cityName);
       require(cityIndex < mapArray.length, "Wrong City Name");

       if(users[userIndex].money >= number)
       {
           users[userIndex].money -= number;
           mapArray[cityIndex].numberOfsoldiers += number;
       }
       else
       {
           mapArray[cityIndex].numberOfsoldiers += users[userIndex].money;
           users[userIndex].money -= users[userIndex].money;
       }
    }

    function makeFortress(string memory userID, string memory cityName) public
    {
       uint256 userIndex = findUserByUserID(userID);
       uint256 cityIndex = findCityByName(userID, cityName);
       require(cityIndex < mapArray.length, "Wrong City Name");
       require(users[userIndex].money >= 100, "Not Enough Money to Buy fortress");

       users[userIndex].money -= 100;
       mapArray[cityIndex].fortress = true;
    }

    function colletTax(string memory userID) public
    {
       uint256 userIndex = findUserByUserID(userID);

       users[userIndex].money = users[userIndex].money + uint32((now - users[userIndex].taxTime) * 10);
       users[userIndex].taxTime = now;
    }

    function attack(string memory userID_A, string memory cityName_A, uint32 a_solider ,string memory userID_B, string memory cityName_B) public 
    {
        uint256 cityIndex_a = findCityByName(userID_A, cityName_A);
        require(mapArray[cityIndex_a].numberOfsoldiers >= a_solider, "Too Much Soldiers than you have");
        require(cityIndex_a < mapArray.length, "Wrong Owner's City Name");

        
        uint256 userIndex_b = findUserByUserID(userID_B);
        require(userIndex_b < users.length, "No Corresponding user, please SIGN UP");
        uint256 cityIndex_b = findCityByName(userID_B, cityName_B);
        require(cityIndex_b < mapArray.length, "Wrong enemy's City Name");

        uint32 b_solider = mapArray[cityIndex_b].numberOfsoldiers;

        if(mapArray[cityIndex_b].fortress) b_solider *= 2;

        if(a_solider > b_solider)
        {
            uint32 hpReduction = a_solider - b_solider;

            if(mapArray[cityIndex_b].hp <= hpReduction)
            {
                if(mapArray[cityIndex_b].capital) users[userIndex_b].survival = false;

                mapArray[cityIndex_b].owner = userID_A;
                mapArray[cityIndex_a].numberOfsoldiers -= a_solider;
                mapArray[cityIndex_b].numberOfsoldiers = a_solider - b_solider - mapArray[cityIndex_b].hp;
                mapArray[cityIndex_b].hp = 10;
            }
            else
            {
                mapArray[cityIndex_a].numberOfsoldiers -= a_solider;
                mapArray[cityIndex_b].numberOfsoldiers = 0;
                mapArray[cityIndex_b].hp -= hpReduction;
            }
        }
        else
        {
            mapArray[cityIndex_b].numberOfsoldiers -= a_solider;
            mapArray[cityIndex_a].numberOfsoldiers -= a_solider;
        }       
    }

    function heal(string memory userID, string memory cityName) public
    {
       uint256 cityIndex = findCityByName(userID, cityName);
       require(cityIndex < mapArray.length, "Wrong City Name");

       if(mapArray[cityIndex].hp <= 50) mapArray[cityIndex].hp += 50;
       else mapArray[cityIndex].hp = 100;
    }
}