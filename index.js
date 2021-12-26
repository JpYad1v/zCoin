// AUTHOR - B GNANESHWARI
// ZCOIN - INDEX FILE

// REQUIRE MODUULES
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('sync-mysql');

// REQUIRE LOCAL FILE
const nomicsCoin = require('./getCryptoPrices.js');
const timestamp = require('./timestamp.js');
//console.log(typeof(nomicsCoin.getPrice("BNB")));
//console.log(timestamp.getTimeStamp());

// CONNECTION STRING FOR SQL
var con = new mysql({
  host: "localhost",
  user: "root",
  password: "root",
  database: "zc"
});

// USE & SET FOR APP EXPRESS
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// APPLICATION GET POST

// GET HOME PAGE
app.get("/", (req, res) => {
  res.render('home');
})

// GET GET STARTED PAGE
app.get("/getstarted", (req, res) => {
  res.render('get-started', {success:'', failure : ''});
});

// POST GET STARTED PAGE
app.post("/getstarted", (req, res) => {

  console.log("\nGET STARTED LOGS\n------------------------------------------------------------------------------------------------\n");
  var fullName = req.body.fname;
  var userName = req.body.uname;
  var gender = req.body.gender;
  var emailID = req.body.emailid;
  var password = req.body.psw;
  var reward = 1000;

  console.log("FULL NAME = " + fullName);
  console.log("USERNAME = " + userName);
  console.log("GENDER = " + gender);
  console.log("EMAIL ID = " + emailID);
  console.log("PASSWORD = " + password);
  console.log("REWARD = " + reward);

  const getStartedResult = con.query(`INSERT INTO investors (FirstName, UserName, Gender, EmailId, Passwrd, Reward) VALUES ('${fullName}', '${userName}', '${gender}', '${emailID}', '${password}', ${reward});`);
  if (getStartedResult.affectedRows > 0) {
    console.log("REGISTRATION SUCCESSFULL");
    res.render('get-started', {success:'success', failure : ''});
  } else {
    console.log("ERROR - INSERTING DATA TO THE DATABASE.");
    res.render('get-started', {success:'', failure : 'failure'});
  }

})

// INVESTOR SECTION BEGIN *****
// GET INVESTOR LOGIN PAGE
app.get("/investorlogin", (req, res) => {
  res.render('investor/investor-login', {failure:''})
});

// POST INVESTOR LOGIN PAGE
// MAKE USERNAME GLOBAL TO ACCESSS THROUGHT THE APPLICATION
var investorUsername;
app.post("/investorlogin", (req, res) => {

  console.log("\nINVESTOR LOGIN LOGS\n------------------------------------------------------------------------------------------------\n");

  investorUsername = req.body.uname;
  var investorPassword = req.body.psw;
  console.log("LOGIN USERNAME = " + investorUsername);
  console.log("LOGIN PASSWORD = " + investorPassword);

  const investorResult = con.query(`SELECT UserName, Passwrd FROM investors WHERE UserName = '${investorUsername}';`);
  if(investorResult.length == 1) {
    var dbUsername = investorResult[0]['UserName'];
    var dbPassword = investorResult[0]['Passwrd'];
    console.log("DB USERNAME = " + dbUsername);
    console.log("DB PASSWORD = " + dbPassword);
    if (dbUsername == investorUsername && dbPassword == investorPassword) {
      console.log("LOGIN SUCCESS");
      // SESSION START
      // INVESTOR DASHBOARD
      // SEND DB COINS TO INVESTOR DASHBOARD
      console.log("\nINVESTOR DASHBOARD LOGS\n------------------------------------------------------------------------------------------------\n");
      const selectCoinSymbolResult = con.query(`SELECT CoinSymbol FROM addcoin;`);
      var dbCoins = "";
      for (let i = 0; i < selectCoinSymbolResult.length; i++) {
        dbCoins += selectCoinSymbolResult[i]['CoinSymbol'] + ",";
      }
      dbCoins = dbCoins.substring(0, dbCoins.length - 1);
      console.log("DATABASE COINS = " + dbCoins);

      res.render('investor/investor-dashboard', {
        dbCoins: dbCoins
      });

    } else {
      res.render('investor/investor-login', {failure:'failure'})
      console.log("USERNAME or PASSWORD NOT MATCHED");
    }
  } else {
    res.render('investor/investor-login', {failure:'failure'})
    console.log("USERNAME DOESNOT EXIST");
  }

})

// 1. GET INVESTOR DASHBOARD PAGE
app.get("/investordb", (req, res) => {

  console.log("\nINVESTOR DASHBOARD LOGS\n------------------------------------------------------------------------------------------------\n");
  const selectCoinSymbolResult = con.query(`SELECT CoinSymbol FROM addcoin;`);
  var dbCoins = "";
  for (let i = 0; i < selectCoinSymbolResult.length; i++) {
    dbCoins += selectCoinSymbolResult[i]['CoinSymbol'] + ",";
  }
  dbCoins = dbCoins.substring(0, dbCoins.length - 1);
  console.log("DATABASE COINS = " + dbCoins);

  res.render('investor/investor-dashboard', {
    dbCoins: dbCoins
  })
});
app.get("/assets", (req, res) => {
  res.render('investor/assets');
})

// 2. GET WATCHLIST PAGE
app.get("/watchlist", (req, res) => {
  console.log("\nWATCHLIST DASHBOARD LOGS\n------------------------------------------------------------------------------------------------\n");
  const selectCoinSymbolResult = con.query(`SELECT CoinSymbol FROM watchlist WHERE UserName = '${investorUsername}';`);
  var dbCoins = "";
  for (let i = 0; i < selectCoinSymbolResult.length; i++) {
    dbCoins += selectCoinSymbolResult[i]['CoinSymbol'] + ",";
  }
  dbCoins = dbCoins.substring(0, dbCoins.length - 1);
  console.log("DATABASE COINS = " + dbCoins);

  res.render('investor/watchlist', {
    dbCoins: dbCoins
  })
})
app.get("/remove", (req, res) => {

  console.log("\nDELETE SYMBOL LOGS\n------------------------------------------------------------------------------------------------\n");
  console.log("DELETE SYMBOL = " + req.originalUrl.split("=")[1]);
  var deleteSymbol = req.originalUrl.split("=")[1]
  const deleteWatchlistCoinResult = con.query(`DELETE FROM watchlist WHERE CoinSymbol = '${deleteSymbol}' AND UserName = '${investorUsername}';`);
  if(deleteWatchlistCoinResult.affectedRows > 0) {
    console.log(`${deleteSymbol} REMOVED SUCCESSFULLY`);
  } else {
    console.log(`ERROR`);
  }
  res.redirect('/watchlist')
})

// 5. GET INVESTOR LOGOUT
app.get("/logout", (req, res) => {
  res.render('home');
})

// *****************************************************************************

//ADMIN SECTION BEGIN *****
// GET ADMIN DASHBOARD PAGE
app.get("/admindb", (req, res) => {

  console.log("\nADMIN DASHBOARD LOGS\n------------------------------------------------------------------------------------------------\n");
  // 1. TOTAL PLATFORM COUNT
  const CoinSymbolCountResult = con.query(`SELECT COUNT(CoinSymbol) FROM addcoin;`);
  var totalPlatformCoins = CoinSymbolCountResult[0]['COUNT(CoinSymbol)'];
  console.log("TOTAL PLATFORM COINS = " + totalPlatformCoins);

  // 2. TOTAL REGISTRATION COUNT
  const UserNameCountResult = con.query(`SELECT COUNT(UserName) FROM investors;`);
  var totalRegistrationCount = UserNameCountResult[0]['COUNT(UserName)'];
  console.log("TOTOAL USERS = " + totalRegistrationCount);

  // 3. TOTAL BUY ORDERS
  const totalBuyPriceResult = con.query(`SELECT BuyPrice FROM buyCoin;`);
  var totalBuyPrice = 0;
  for (let i = 0; i < totalBuyPriceResult.length; i++) {
    totalBuyPrice += totalBuyPriceResult[i]['BuyPrice'];
  }
  console.log("TOTAL BUY ORDERS = " + totalBuyPrice);

  // 4. RECENT COIN LISTINGS
  const recentCoinListingResult = con.query(`SELECT CoinSymbol, CurrentTimeStamp FROM addCoin ORDER BY CoinID DESC LIMIT 5;`);
  var coinSymbol = "";
  var currentTimestamp = "";
  for (let i = 0; i < recentCoinListingResult.length; i++) {
    coinSymbol += recentCoinListingResult[i]['CoinSymbol'] + ",";
    currentTimestamp += recentCoinListingResult[i]['CurrentTimeStamp'] + ",";
  }
  var symbols = coinSymbol.substring(0, coinSymbol.length - 1);
  var timestamps = currentTimestamp.substring(0, currentTimestamp.length -1);
  console.log("RECENT COIN LISTING");
  console.log("SYMBOLS = " + symbols);
  console.log("TIMESTAMPS = " + timestamps);

  // 5. RECENT BUY ORDERS
  const recentBuyOrdersResult = con.query(`SELECT UserName, CoinSymbol, BuyPrice FROM buyCoin ORDER BY BuyCoinID DESC LIMIT 5;`);
  var buyUsers = "";
  var buySymbols = "";
  var buyPrices = "";
  for (let i = 0; i < recentBuyOrdersResult.length; i++) {
    buyUsers += recentBuyOrdersResult[i]['UserName'] + ",";
    buySymbols += recentBuyOrdersResult[i]['CoinSymbol'] + ",";
    buyPrices += recentBuyOrdersResult[i]['BuyPrice'] + ",";
  }
  var buyuser = buyUsers.substring(0, buyUsers.length - 1);
  var buysymbol = buySymbols.substring(0, buySymbols.length - 1);
  var buyPrice = buyPrices.substring(0, buyPrices.length - 1);
  console.log("RECENT BUY ORDERS");
  console.log("BUY USERS = " + buyuser);
  console.log("BUY SYMBOLS = " + buysymbol);
  console.log("BUY PRICES = " + buyPrice);

  res.render('admin/admin-dashboard', {
    totalPlatformCoins: totalPlatformCoins,
    totalRegistrationCount: totalRegistrationCount,
    totalBuyPrice: totalBuyPrice,
    symbols: symbols,
    timestamps: timestamps,
    buyuser: buyuser,
    buysymbol: buysymbol,
    buyPrice: buyPrice
  });
})

// GET ADD COIN PAGE
// NOTE * ADD ALL THE SYMBOLS AVAILBLE IN THE DB TO ADD COIN PAGE : AS THE ADMIN DONOT KNOW TO MANAGE ALL COINS
app.get("/addCoin", (req, res) => {
  res.render('admin/addCoin', {success:'', failure:'', successDel:'', failureDel:''});
})

// POST ADD COIN PAGE
app.post("/addCoin", (req, res, next) => {

  console.log("\nMANAGE COIN LOGS\n------------------------------------------------------------------------------------------------\n");

  var buttonType = req.body.btntype;
  console.log("ACTION = " + buttonType);

  var symbol = req.body.newcoin;
  symbol = symbol.toUpperCase();

  if (buttonType == "add") {
    try {
      // * ADD COIN TO DB {PARAMS = COINSYMBOL, TIMESTAMP, COINSYMBOL ID}
      // 1. GET COIN SYMBOL
      console.log("ADD SYMBOL FROM ADMIN = " + symbol);
      // CHECK AN API CALL {IF RETURN SUCCESS CONTINUE ; ELSE EXECUTES CATCH BLOCK}
      nomicsCoin.getPrice(symbol);
      // 2. GET CURRENT TIMESTAMP
      var currentTimestamp = timestamp.getTimeStamp();
      console.log("CURRENT TIMESTAMP = " + currentTimestamp);
      // 3. GET COIN SYMBOL ID
      const CoinSymbolCountResult = con.query(`SELECT COUNT(CoinSymbol) FROM addcoin;`);
      var totalPlatformCoins = CoinSymbolCountResult[0]['COUNT(CoinSymbol)'];
      console.log("TOTAL PLATFORM COINS = " + totalPlatformCoins);

      // ADD TO DB
      const symbolInsertResult = con.query(`INSERT INTO addcoin (CoinSymbol, CurrentTimeStamp, CoinID) VALUES ('${symbol}', '${currentTimestamp}', '${totalPlatformCoins + 1}')`);
      if (symbolInsertResult.affectedRows > 0) {
        res.render('admin/addCoin', {success:'success', failure:'', successDel:'', failureDel:''});
      }
      else {
        res.render('admin/addCoin', {success:'', failure:'failure', successDel:'', failureDel:''});
      }
    }
    catch (err) {
      console.log("ENTERED CATCH BLOCK : INVALID COIN or COIN ALREADY EXIST");
      res.render('admin/addCoin', {success:'', failure:'failure', successDel:'', failureDel:''});
    }
  }
  else if (buttonType == "remove") {
    console.log("REMOVE SYMBOL FROM ADMIN = " + symbol);
    const symbolDeleteResult = con.query(`DELETE FROM addCoin WHERE CoinSymbol = '${symbol}';`);
    if (symbolDeleteResult.affectedRows > 0) {
      res.render('admin/addCoin', {success:'', failure:'', successDel:'success', failureDel:''});
    }
    else {
      res.render('admin/addCoin', {success:'', failure:'', successDel:'', failureDel:'failure'});
    }
  }


})

// START SERVER & LISTEN ON PORT 4438
app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})
