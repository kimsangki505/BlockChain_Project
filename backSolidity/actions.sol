 pragma solidity ^0.5.11;

import "./userdata.sol";

contract Acctions is userStatus {

    function findUserByUserID(string memory userID) internal returns (uint256 result)
    {
        for(uint32 i = 0 ; i < users.length ; i++)
        {
            if(keccak256(abi.encodePacked((users[i].userID))) == keccak256(abi.encodePacked((userID)))) return i;
        }

        return users.length + 10;
    }


    function findCityByName(string memory userID, string memory name) internal returns (uint256 result)
    {

        for(uint32 i = 0 ; i < mapArray.length ; i++)
        {
            bool ownerCheck = keccak256(abi.encodePacked((mapArray[i].owner))) == keccak256(abi.encodePacked((userID)));
            bool cityNameCheck = keccak256(abi.encodePacked((mapArray[i].name))) == keccak256(abi.encodePacked((name)));
            if(ownerCheck && cityNameCheck) return i;
        }

        return mapArray.length + 10;
    }

    function makeAccount(address ethereumAddress, string memory userID, string memory userPassword) internal
    {
       require(findUserByUserID(userID) > users.length, "DUPLICATE USERID, USER ANOTHER ID");

       uint256 position = mapArray.length + 1;

       city memory newUserCapitalCity = city(userID, true, 100,  string(abi.encodePacked(userID, userPassword)), position, false, 0);
       mapArray.push(newUserCapitalCity);
       userData memory newUser = userData(ethereumAddress, userID, userPassword, true, 0, now);
       users.push(newUser);
    }

    function login(string memory userID, string memory userPassword) internal
    {
        uint256 userIndex = findUserByUserID(userID);
        require(userIndex < users.length, "No Corresponding user, please SIGN UP");

        bool idCheck = keccak256(abi.encodePacked((users[userIndex].userID))) == keccak256(abi.encodePacked((userID)));
        bool passwordCheck = keccak256(abi.encodePacked((users[userIndex].userPassword))) == keccak256(abi.encodePacked((userPassword)));
        bool loginStatus = idCheck && passwordCheck;

        require(loginStatus, "Wrong ID or Password");
    }

    function produceSolider(string memory userID, string memory cityName, uint32 number) internal
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

    function makeFortress(string memory userID, string memory cityName) internal
    {
       uint256 userIndex = findUserByUserID(userID);
       uint256 cityIndex = findCityByName(userID, cityName);
       require(cityIndex < mapArray.length, "Wrong City Name");
       require(users[userIndex].money >= 100, "Not Enough Money to Buy fortress");

       users[userIndex].money -= 100;
       mapArray[cityIndex].fortress = true;
    }

    function colletTax(string memory userID) internal
    {
       uint256 userIndex = findUserByUserID(userID);

       users[userIndex].money = users[userIndex].money + uint32((now - users[userIndex].taxTime) * 10);
       users[userIndex].taxTime = now;
    }

    function attack(string memory userID_A, string memory cityName_A, string memory userID_B, string memory cityName_B) internal 
    {
        
        uint256 userIndex_a = findUserByUserID(userID_A);
        uint256 cityIndex_a = findCityByName(userID_A, cityName_A);
        require(cityIndex_a < mapArray.length, "Wrong Owner's City Name");

        
        uint256 userIndex_b = findUserByUserID(userID_B);
        uint256 cityIndex_b = findCityByName(userIndex_b, cityName_B);
        require(cityIndex_b < mapArray.length, "Wrong enemy's City Name");


        uint256 a_solider = users[userIndex_a].cities[cityIndex_a].numberOfsoldiers;
        uint256 b_solider = users[userIndex_b].cities[cityIndex_b].numberOfsoldiers;
        if(users[userIndex_b].cities[cityIndex_b].fortress) b_solider *= 2;

        if(a_solider > b_solider)
        {
            users[userIndex_a].cities[cityIndex_a].numberOfsoldiers = 0;
            users[userIndex_b].cities[cityIndex_b].numberOfsoldiers = 0;

            uint32 hpReduction = a_solider - b_solider;

            if(users[userIndex_b].cities[cityIndex_b].hp <= hpReduction)
            {
                if(users[userIndex_b].cities[cityIndex_b].capital) users[userIndex_b].survival = false;
                

                city memory element = users[userIndex_b].cities[cityIndex_b];
                users[userIndex_b].cities[cityIndex_b] = users[userIndex_b].cities[users[userIndex_b].cities.length - 1];
                delete users[userIndex_b].cities[users[userIndex_b].cities.length - 1];
                users[userIndex_b].cities.length--;
                users[userIndex_b].numberOfCity--;

                element.hp = 10;
                element.numberOfsoldiers = a_solider - b_solider - users[userIndex_b].cities[cityIndex_b].hp;

                users[a_solider].numberOfCity = users[a_solider].cities.push(element) + 1;
            }
            else
            {
                users[userIndex_b].cities[cityIndex_b].hp -= hpReduction;
            }
        }
        else
        {
            users[userIndex_a].cities[cityIndex_a].numberOfsoldiers = 0;
            users[userIndex_b].cities[cityIndex_b].numberOfsoldiers -= a_solider;
        }       
    }

    function heal(string memory userID, string memory cityName) internal
    {
       uint256 userIndex = findUserByUserID(userID);
       uint256 cityIndex = findCityByName(userID, cityName);
       require(cityIndex < mapArray.length, "Wrong City Name");

       if(users[userIndex].cities[cityIndex].hp <= 50) users[userIndex].cities[cityIndex].hp += 50;
       else users[userIndex].cities[cityIndex].hp = 100;
    }
}