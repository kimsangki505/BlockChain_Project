var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var Web3 = require('web3');
var net = require('net');

var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: false }));

var owner_address = "0xeB9cB8626AE503F9C575fEA7f60F980AE70c5e1C";
var action_address = "0xa8A8E8ce5a628D8A2cC5c2Fe3CEE98935865485F";

var action_Contract_abi = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "userID_A",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cityName_A",
				"type": "string"
			},
			{
				"internalType": "uint32",
				"name": "a_solider",
				"type": "uint32"
			},
			{
				"internalType": "string",
				"name": "userID_B",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cityName_B",
				"type": "string"
			}
		],
		"name": "attack",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "userID",
				"type": "string"
			}
		],
		"name": "colletTax",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "userID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cityName",
				"type": "string"
			}
		],
		"name": "heal",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "ethereumAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "userID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userPassword",
				"type": "string"
			}
		],
		"name": "makeAccount",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "userID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cityName",
				"type": "string"
			}
		],
		"name": "makeFortress",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "userID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "cityName",
				"type": "string"
			},
			{
				"internalType": "uint32",
				"name": "number",
				"type": "uint32"
			}
		],
		"name": "produceSolider",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "userID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userPassword",
				"type": "string"
			}
		],
		"name": "login",
		"outputs": [],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "mapArray",
		"outputs": [
			{
				"internalType": "string",
				"name": "owner",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "capital",
				"type": "bool"
			},
			{
				"internalType": "uint32",
				"name": "hp",
				"type": "uint32"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "position",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "fortress",
				"type": "bool"
			},
			{
				"internalType": "uint32",
				"name": "numberOfsoldiers",
				"type": "uint32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "returnMapData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "owner",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "capital",
						"type": "bool"
					},
					{
						"internalType": "uint32",
						"name": "hp",
						"type": "uint32"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "position",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "fortress",
						"type": "bool"
					},
					{
						"internalType": "uint32",
						"name": "numberOfsoldiers",
						"type": "uint32"
					}
				],
				"internalType": "struct mapInfo.city[]",
				"name": "map",
				"type": "tuple[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "userID",
				"type": "string"
			}
		],
		"name": "returnUserData",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "ethereumAccount",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "userID",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "userPassword",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "survival",
						"type": "bool"
					},
					{
						"internalType": "uint32",
						"name": "money",
						"type": "uint32"
					},
					{
						"internalType": "uint256",
						"name": "taxTime",
						"type": "uint256"
					}
				],
				"internalType": "struct userStatus.userData",
				"name": "user",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "address",
				"name": "ethereumAccount",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "userID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userPassword",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "survival",
				"type": "bool"
			},
			{
				"internalType": "uint32",
				"name": "money",
				"type": "uint32"
			},
			{
				"internalType": "uint256",
				"name": "taxTime",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

var action_Contract = new web3.eth.Contract(action_Contract_abi, action_address, { from: owner_address });

app.get('/', function (req, res) {
    res.writeHead(301, { Location: 'http://127.0.0.1:3000/login' });
    res.end();
});

app.get('/login', function (req, res) {
    res.render('login', {});
});

app.post('/login_post', function (req, res) {
    var Username = req.body.Username;
    var Password = req.body.Password;

    action_Contract.methods.login(Username, Password).call({ from: owner_address })
        .then(function (value) {
            res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' +  Username });
            res.write(Username);
            res.end();
        }).catch(function (error) {
            console.log(error);
            res.writeHead(301, { Location: 'http://127.0.0.1:3000/login' });
            res.end();
        });
});


app.get('/signup', function (req, res) {
    res.render('signup', {});
});

app.post('/signup_post', function (req, res) {
    var account = req.body.ethereum_account;
    var Username = req.body.Username;
    var Password = req.body.Password;
    var Repeat_Password = req.body.Repeat_Password

    if (Repeat_Password == Repeat_Password) {
        action_Contract.methods.makeAccount(account, Username, Password).send({ from: account, gas:500000 })
            .then(function (value) {
                console.log(value);
                res.writeHead(301, { Location: 'http://127.0.0.1:3000/login' });
                res.end();
            }).catch(function (error) {
                console.log(error);
                res.writeHead(301, { Location: 'http://127.0.0.1:3000/signup' });
                res.end();
            });
    }
    else
    {

    }
});

app.get('/main/:userID/', function (req, res) {

    var userid = req.params.userID;

    collector = []

    collector.push(action_Contract.methods.returnUserData(userid).call({ from: owner_address }));
    collector.push(action_Contract.methods.returnMapData().call({ from: owner_address }));

    Promise.all(collector)
    .then(function(value){

        var userData = value[0];
        var mapData = value[1]
        
        var user_etheraccount = userData.ethereumAccount;
        var user_survival = userData.survival;
        var user_money = userData.money;

        collector_my_city = [];
        collector_enemy_city = []; 

        for(var i = 0 ; i < mapData.length ; i++)
        {
            if(mapData[i].owner == userid) collector_my_city.push(mapData[i]);
            else collector_enemy_city.push(mapData[i]);
        }

        console.log(collector_my_city);

        res.render('mainpage', {
            userid: userid,
            Survival:user_survival,
            user_money:user_money,
            user_etheraccount:user_etheraccount,
            user_cities:collector_my_city,
            enemy_cities:collector_enemy_city
        });


    })
    .catch(function(error){
        console.log(error);
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});


app.post('/produceSolider/:userID/', function (req, res) {
    var userid = req.params.userID;
    var useraccount = req.body.userAccount;
    var usercity = req.body.user_city.split(',')
    var numOfsolider = req.body.number

    action_Contract.methods.produceSolider(userid, usercity[1].trim(), numOfsolider).send({ from: useraccount, gas:500000 })
    .then(function(value){
        console.log(value);
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid });
        res.end();
    }).catch(function(error){
        console.log(error);
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});

app.post('/makeFortress/:userID/', function (req, res) {
    var userid = req.params.userID;
    var useraccount = req.body.userAccount;
    var usercity = req.body.user_city.split(',')

    action_Contract.methods.makeFortress(userid, usercity[1].trim()).send({ from: useraccount, gas:500000 })
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});

app.post('/colletTax/:userID/', function (req, res) {
    var userid = req.params.userID;
    var useraccount = req.body.userAccount;
    
    action_Contract.methods.colletTax(userid).send({ from: useraccount, gas:500000 })
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});

app.post('/attack/:userID/', function (req, res) {
    var userid_a = req.params.userID;
    var useraccount = req.body.userAccount;
    var numOfsolider = req.body.number
    var usercity_a = req.body.user_city_a.split(',')
    var user_city_b = req.body.user_city_b.split(',')

    action_Contract.methods.attack(userid_a, usercity_a[1].trim(), numOfsolider, user_city_b[0].trim(), user_city_b[1].trim()).send({ from: useraccount, gas:500000 })
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid_a});
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid_a});
        res.end();
    });
});

app.post('/heal/:userID/', function (req, res) {
    var userid = req.params.userID;
    var useraccount = req.body.userAccount;
    var usercity = req.body.user_city.split(',')

    action_Contract.methods.heal(userid, usercity[1].trim()).send({ from: useraccount, gas:500000 })
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});

app.listen(3000, function () {
    console.log("connected 3000 port");
});
