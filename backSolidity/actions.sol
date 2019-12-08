pragma solidity ^0.5.11;

import "./userdata.sol";

contract CustomToken {

    function findUserByUserID(strint userID) internal returns (uint32 result)
    {
        for(uint32 i = 0 ; i < numberOfuser ; i++)
        {
            if(users[i].account.userID == userID) return i;
        }

        return numberOfuser + 10;
    }


    function findCityByName(unit32 userIndex, string name) internal returns (uint32 result)
    {
        userData user = users[unserIndex];

        for(uint32 i = 0 ; i < user.numberOfCity ; i++)
        {
            if(user.cities[i].name == name) return i;
        }

        return user.numberOfCity + 10;
    }

    function makeAccount(addres ethereumAddress, string userID, string userPassword) internal
    {
       require(findUserByUserID(userID) > numberOfuser);
       (p_x, p_y) = selectCity();
       require(p_x < 100 && p_y < 100);
       userAccount newUserAccount = userAccount(ethereumAddress, userID, userPassword);
       city newUserCapitalCity = city(true, 100, userId + "_1", position(p_x, p_y), false, 0);
       userData newUser = userData(newUserAccount, true, 1, city, 0, now);
       numberOfuser = users.push(newUser) + 1;
    }

    function login(string userID, string userPassword) internal returns (bool result)
    {
        userIndex = findUserByUserID(userID);
        require(userIndex < numberOfuser);

        loginStatus = users[userIndex].account.userID == userID && users[userIndex].account.userPassword == userPassword;

        if(loginStatus) return true;
        else return false;
    }

    function produceSolider(string userID, string cityName, uint32 number) internal
    {
       userIndex = findUserByUserID(userID);
       cityIndex = findCityByName(userID, cityName);
       require(cityIndex < users[userIndex].numberOfCity);

       if(users[userIndex].money >= number)
       {
           users[userIndex].money -= number;
           users[userIndex].cities[cityIndex].numberOfsoliders += number;
       }
       else
       {
           users[userIndex].cities[cityIndex].numberOfsoliders += users[userIndex].money;
           users[userIndex].money -= users[userIndex].money;
       }
    }

    function makeFortress(string userID, string cityName) internal returns()
    {
       userIndex = findUserByUserID(userID);
       cityIndex = findCityByName(userID, cityName);
       require(cityIndex < users[userIndex].numberOfCity);
       require(users[userIndex].money >= 100);

       users[userIndex].money -= 100;
       users[userIndex].cities[cityIndex].fortress = true;
    }

    function colletTax(string userID) internal returns()
    {
       userIndex = findUserByUserID(userID);

       users[userIndex].money += (now - users[userIndex].taxTime) * 10;
       users[userIndex].taxTime = now;
    }

    function attack(string userID_A, string cityName_A, string userID_B, string cityName_B) internal returns()
    {
        
        userIndex_a = findUserByUserID(userID);
        cityIndex_a = findCityByName(userID, cityName);
        require(cityIndex_a < users[userIndex_a].numberOfCity);
        
        userIndex_b = findUserByUserID(userID);
        cityIndex_b = findCityByName(userID, cityName);
        require(cityIndex_b < users[userIndex_b].numberOfCity);

        a_solider = users[userIndex_a].cities[cityIndex_a].numberOfsoldiers;
        b_solider = users[userIndex_b].cities[cityIndex_b].numberOfsoldiers;
        if(users[userIndex_b].cities[cityIndex_b].fortress) b_solider *= 1.3;

        if(a_solider > b_solider)
        {
            users[userIndex_a].cities[cityIndex_a].numberOfsoldiers = 0;
            users[userIndex_b].cities[cityIndex_b].numberOfsoldiers = 0;

            hpReduction = a_solider - b_solider;

            if(users[userIndex_b].cities[cityIndex_b].hp <= hpReduction)
            {
                if(users[userIndex_b].cities[cityIndex_b].capital) users[userIndex_b].survival = false;
                

                city element = users[userIndex_b].cities[cityIndex_b];
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

    function heal(string userID, string cityName) internal returns()
    {
       userIndex = findUserByUserID(userID);
       cityIndex = findCityByName(userID, cityName);
       require(cityIndex < users[userIndex].numberOfCity);

        += 50;
       if(users[userIndex].cities[cityIndex].hp <= 50) users[userIndex].cities[cityIndex].hp += 50;
       else users[userIndex].cities[cityIndex].hp = 100;
    }
}