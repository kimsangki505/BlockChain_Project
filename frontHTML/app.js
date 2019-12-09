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
var action_address = "0xE5e012DBafAaa7F393F54e2b08c9b3Dfb70B5883";

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
        console.log(value);
        res.render('mainpage', {
            userid: userid
        });
    }).catch(function(error){
        console.log(error);
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});

/*
app.post('/produceSolider', function (req, res) {
    var userid = req.body.userid;
    var useraccount = req.body.useraccount;

    action_Contract.methods.produceSolider(userid, string memory cityName, uint32 number).send({ from: useraccount, gas:500000 }).send({ from: owner_address, gas:500000 })
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid });
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});

app.post('/makeFortress', function (req, res) {
    var userid = req.body.userid;

    action_Contract.methods.makeFortress(string memory userID, string memory cityName).send({ from: owner_address, gas:500000 })
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});

app.post('/colletTax', function (req, res) {
    var userid = req.body.userid;
    
    action_Contract.methods.colletTax(string memory userID).send({ from: owner_address, gas:500000 })
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});

app.post('/attack', function (req, res) {
    var userid = req.body.userid;

    action_Contract.methods.attack(string memory userID_A, string memory cityName_A, uint32 a_solider ,string memory userID_B, string memory cityName_B).send({ from: owner_address, gas:500000 })
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});

app.post('/heal', function (req, res) {
    var userid = req.body.userid;

    action_Contract.methods.heal(string memory userID, string memory cityName).send({ from: owner_address, gas:500000 })
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main/' + userid});
        res.end();
    });
});
*/
app.listen(3000, function () {
    console.log("connected 3000 port");
});
