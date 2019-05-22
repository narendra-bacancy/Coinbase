var express = require("express");
var bodyParser = require("body-parser");
var app = express();
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;
const Gdax = require('gdax');
const publicClient = new Gdax.PublicClient();
var crypto = require('crypto');

const key = 'c3d7dff02dac28c4b584857b3fbfdf21';
const secret = 'gSeP/Ydc72SJBztyADsHm/LgiAlQZF13osKK7bdXJbXjQFG8szWmLDbPyn6yKdqAida2lOkmVhK8mn/5nnSMwQ==';
const passphrase = '52lvepelz5l';

const apiURI = 'https://api.pro.coinbase.com';
const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

const authedClient = new Gdax.AuthenticatedClient(
  key,
  secret,
  passphrase,
  apiURI
);

app.get('/getaccount',(req,res) => {
  var accountobj = authedClient.getAccounts((err,response,data) => {
    if (err) {
      res.json({"Error" : err});
    } else {
      res.send(JSON.parse(JSON.stringify(data)));
    }
  });
})

app.post('/getaccountHistory',(req,res) => {
  const accountID = req.body.accountID;
  // For pagination, you can include extra page arguments
  // authedClient.getAccountHistory(accountID, { before: 3000 }, callback);

  var accountobj = authedClient.getAccountHistory(accountID,(err,response,data) => {
    if (err) {
      res.json({"Error" : err});
    } else {
      res.send(JSON.parse(JSON.stringify(data)));
    }
  });
})


app.post('/withdrawals',(req,res) => {
  
  const withdrawAddressParams = {
    "amount": req.body.amount,
    "currency": req.body.currency,
    "crypto_address": req.body.crypto_address, // BTC Coinbase Account ID
  };  
    authedClient.withdrawCrypto(withdrawAddressParams, (error, response, data) => {
      if (error) {
        res.json({"Error" : error});
      } else {
        res.json({"Data" : data});
      }
    });
})

var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});