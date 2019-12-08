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

var owner_address = "0xc1a90FECD4269B7Dd0c8fe81328CB2A5d308F2Dc";
var action_address = '0x2df3d20CceD1D1E20152CC596D160a19b7c6e5AA';

var token_Contract_abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
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
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
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
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_tokenName",
                "type": "string"
            },
            {
                "name": "_tokenSymbol",
                "type": "string"
            },
            {
                "name": "_decimalUnits",
                "type": "uint8"
            },
            {
                "name": "_initialSupply",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_from",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

var token_Contract = new web3.eth.Contract(token_Contract_abi, token_contractAddress, { from: owner_address });

app.get('/', function (req, res) {
    res.send(
        "<a href=\"http://127.0.0.1:3000/beneficiary\"> Beneficiary Main Page </a> <br> \
        <a href=\"http://127.0.0.1:3000/investor\"> Investor Main Page </a>");
});

app.post('/main_beneficiary_receiver', function (req, res) {

    crowd_Contract.methods.withdraw().send({ from: owner_address }).then(function (value) {
        res.writeHead(301, { Location: 'http://127.0.0.1:3000/beneficiary' });
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

                    res.render('main_beneficiary', {
                        Current_Status: status,
                        funded_current_eth: web3.utils.fromWei(values[0], 'ether'),
                        funded_current_ctk: values[4],
                        funded_goal: web3.utils.fromWei(values[3], 'ether'),
                        owner_eth: web3.utils.fromWei(values[1], 'ether'),
                        owner_ctk: values[5],
                        token_unit: values[6],
                        address_crowd_contract: crowd_contractAddress,
                        address_owner: owner_address
                    });
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


app.listen(3000, function () {
    console.log("connected 3000 port");
});
