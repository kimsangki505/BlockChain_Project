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
var action_address = "0xfC837Aa311448508DD09340315A5e5Eb3EAbcF0e";

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

/*
collector.push(web3.eth.getBalance(owner_address));
    collector.push(crowd_Contract);
    collector.push(crowd_Contract.methods.goalAmount().call({ from: owner_address }));
    collector.push(token_Contract.methods.balanceOf(crowd_contractAddress).call({ from: owner_address }));
    collector.push(token_Contract.methods.balanceOf(owner_address).call({ from: owner_address }));
    collector.push(token_Contract.methods.symbol().call({ from: owner_address }));
*/
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
            res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
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

app.get('/main', function (req, res) {
    console.log(req);
    res.render('mainpage', {});
});
/*
app.post('/produceSolider', function (req, res) {
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    });
});

app.post('/makeFortress', function (req, res) {
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    });
});

app.post('/colletTax', function (req, res) {
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    });
});

app.post('/attack', function (req, res) {
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    });
});

app.post('/heal', function (req, res) {
    .then(function(value){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    }).catch(function(error){
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/main' });
        res.end();
    });
});


app.get('/beneficiary', function (req, res) {

    var collector = [];
    collector.push(web3.eth.getBalance(crowd_contractAddress));
    collector.push(web3.eth.getBalance(owner_address));
    collector.push(crowd_Contract.methods.ended().call({ from: owner_address }));
    collector.push(crowd_Contract.methods.goalAmount().call({ from: owner_address }));
    collector.push(token_Contract.methods.balanceOf(crowd_contractAddress).call({ from: owner_address }));
    collector.push(token_Contract.methods.balanceOf(owner_address).call({ from: owner_address }));
    collector.push(token_Contract.methods.symbol().call({ from: owner_address }));

    crowd_Contract.methods.checkGoalReached().send({ from: owner_address }, function (err) {
        console.log(err);
        Promise.all(collector).then(
            function (values) {

                token_Contract.methods.transfer(crowd_contractAddress, values[5]).send({ from: owner_address }).then(function (result) {
                    var status;
                    if (!values[2]) status = "Running";
                    else status = "Finished";

                    
                });
            }
        );
    });


});


app.post('/main_investor_receiver', function (req, res) {


    var account_to_fund = req.body.account_to_fund;
    var amount_of_funding = req.body.amount_of_funding;
    var password = req.body.password;

    console.log(account_to_fund);
    console.log(amount_of_funding);
    console.log(password);

    web3.eth.personal.unlockAccount(account_to_fund, password, 600).then(
        function (blank) {
            console.log("TEST");
            crowd_Contract.methods.fund().send({ from: account_to_fund, value: web3.utils.toWei(String(amount_of_funding), 'ether') },
                function (non_used) {
                    console.log(non_used);
                    console.log("TEST2");
                    var collector = [];
                    collector.push(crowd_Contract.methods.ended().call({ from: owner_address }));
                    collector.push(token_Contract.methods.balanceOf(crowd_contractAddress).call({ from: owner_address }));
                    collector.push(web3.eth.getBalance(crowd_contractAddress));
                    collector.push(crowd_Contract.methods.goalAmount().call({ from: owner_address }));
                    collector.push(token_Contract.methods.balanceOf(account_to_fund).call({ from: owner_address }));

                    Promise.all(collector).then(
                        function (values) {
                            var status;
                            if (!values[0]) status = "Running";
                            else status = "Finished";

                            res.render('main_investor', {
                                Current_Status: status,
                                join_div_block: "block",
                                funded_current_eth: web3.utils.fromWei(values[2], 'ether'),
                                funded_goal: web3.utils.fromWei(values[3], 'ether'),
                                remainig_Token: values[1],
                                investor_input_block: "none",
                                investor_info_block: "block",
                                investor_account: account_to_fund,
                                investor_eth: amount_of_funding,
                                investor_ctk: values[4]
                            });
                        }
                    );

                }
            );

        });

});


app.get('/investor', function (req, res) {
    var collector = [];
    collector.push(crowd_Contract.methods.ended().call({ from: owner_address }));
    collector.push(token_Contract.methods.balanceOf(crowd_contractAddress).call({ from: owner_address }));
    collector.push(web3.eth.getBalance(crowd_contractAddress));
    collector.push(crowd_Contract.methods.goalAmount().call({ from: owner_address }));

    crowd_Contract.methods.checkGoalReached().send({ from: owner_address }, function (err) {
        Promise.all(collector).then(
            function (values) {
                var status;
                if (!values[0]) status = "Running";
                else status = "Finished";


                res.render('main_investor', {
                    Current_Status: status,
                    join_div_block: "block",
                    funded_current_eth: web3.utils.fromWei(values[2], 'ether'),
                    funded_goal: web3.utils.fromWei(values[3], 'ether'),
                    remainig_Token: values[1],
                    investor_input_block: "none",
                    investor_info_block: "none",
                    investor_account: 0,
                    investor_eth: 0,
                    investor_ctk: 0,
                });
            }
        );
    });


});

*/
app.listen(3000, function () {
    console.log("connected 3000 port");
});
