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

  // REWARD DOGE :
  var rewardCoin = 'DOGE';
  var rewardPrice = 100;
  var rank = nomicsCoin.getRank(rewardCoin);
  var coinQty = rewardPrice / nomicsCoin.getPrice(rewardCoin);

  console.log("REWARD COIN = " + rewardCoin);
  console.log("REWARD PRICE = " + rewardPrice);
  console.log("RANK = " + rank);
  console.log("COINQTY = " + coinQty);

  const getStartedResult = con.query(`INSERT INTO investors (FirstName, UserName, Gender, EmailId, Passwrd, Reward) VALUES ('${fullName}', '${userName}', '${gender}', '${emailID}', '${password}', ${reward});`);
  const rewardCoinResult = con.query(`INSERT INTO buycoin (UserName, CoinSymbol, BuyPrice, CoinQty, rank) VALUES ('${userName}', '${rewardCoin}', ${rewardPrice}, '${coinQty}', '${rank}');`);
  if (getStartedResult.affectedRows > 0 && rewardCoinResult.affectedRows > 0) {
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
      const announcementResult = con.query(`SELECT Announcement, CurrentTimeStamp FROM announcements ORDER BY CurrentTimeStamp DESC LIMIT 2;`);
      var announcement = "";
      for (let i = 0; i < announcementResult.length; i++) {
        announcement += announcementResult[i]['Announcement'] + ",";
      }

      dbCoins = dbCoins.substring(0, dbCoins.length - 1);
      announcement = announcement.substring(0, announcement.length - 1);
      console.log("DATABASE COINS = " + dbCoins);
      console.log("ANNOUNCEMENT = " + announcement);

      res.render('investor/investor-dashboard', {
        dbCoins: dbCoins,
        announcement: announcement,
        username: investorUsername
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

// 1. INVESTOR DASHBOARD PAGE
// GET INVESTOR DASHBOARD PAGE
app.get("/investordb", (req, res) => {
  console.log("\nINVESTOR DASHBOARD LOGS\n------------------------------------------------------------------------------------------------\n");
  const selectCoinSymbolResult = con.query(`SELECT CoinSymbol FROM addcoin;`);
  var dbCoins = "";
  for (let i = 0; i < selectCoinSymbolResult.length; i++) {
    dbCoins += selectCoinSymbolResult[i]['CoinSymbol'] + ",";
  }
  const announcementResult = con.query(`SELECT Announcement, CurrentTimeStamp FROM announcements ORDER BY CurrentTimeStamp DESC LIMIT 2;`);
  var announcement = "";
  for (let i = 0; i < announcementResult.length; i++) {
    announcement += announcementResult[i]['Announcement'] + ",";
  }
  dbCoins = dbCoins.substring(0, dbCoins.length - 1);
  announcement = announcement.substring(0, announcement.length - 1);
  console.log("DATABASE COINS = " + dbCoins);
  console.log("ANNOUNCEMENT = " + announcement);

  res.render('investor/investor-dashboard', {
    dbCoins: dbCoins,
    announcement: announcement,
    username: investorUsername
  })
});
// GET ASSETS PAGE
app.get("/assets", (req, res) => {

  console.log("\nGET ASSETS PAGE LOGS\n------------------------------------------------------------------------------------------------\n");
  console.log("ASSET SYMBOL = " + req.originalUrl.split("=")[1]);
  var symbol = req.originalUrl.split("=")[1];
  const rewardPriceResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}';`);
  console.log("PORTFOLIO PRICE = " + rewardPriceResult[0]['Reward']);
  var portfolioPrice = rewardPriceResult[0]['Reward'];
  var description = nomicsCoin.getDescription(symbol);
  res.render('investor/assets', {
    symbol: symbol,
    success: '',
    failure: '',
    portfolioPrice: portfolioPrice,
    description: description
  });
})
// POST ADD SYMBOL TO WATCHLIST
app.post("/assets", (req, res) => {

  console.log("\nADD COIN TO WATCHLIST LOGS\n------------------------------------------------------------------------------------------------\n");
  var watchlistSymbol = req.body.symbol;
  console.log("COIN SYMBOL TO ADD IN WATCHLIST = " + watchlistSymbol);
  const rewardPriceResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}';`);
  var portfolioPrice = rewardPriceResult[0]['Reward'];
  var description = nomicsCoin.getDescription(watchlistSymbol);
  const addSymbolWatchlistResult = con.query(`INSERT INTO watchlist (UserName, CoinSymbol) VALUES ('${investorUsername}', '${watchlistSymbol}')`);
  if (addSymbolWatchlistResult.affectedRows > 0){
    console.log("COIN ADDED TO WATCHLIST");
    res.render('investor/assets', {
      symbol: watchlistSymbol,
      success: 'WatchlistSuccess',
      failure: '',
      portfolioPrice: portfolioPrice,
      description: description
    })
  } else {
    console.log("ERROR WHILE ADDING COIN TO WATCHLIST");
    res.render('investor/assets', {
      symbol: watchlistSymbol,
      success: '',
      failure: 'WatchlistFailed',
      portfolioPrice: portfolioPrice,
      description: description
    })
  }
})
// POST BUY COIN
app.post("/buy", (req, res) => {

  console.log("\nBUY COIN LOGS\n------------------------------------------------------------------------------------------------\n");
  var buyPriceFromInvestor = req.body.price;
  console.log("BUY PRICE FROM INVESTOR = " + buyPriceFromInvestor);
  var buyCoinSymbol = req.body.symbol;
  console.log("BUY COIN SYMBOL = " + buyCoinSymbol);
  const selectWalletPriceResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}';`);
  var investorWalletPrice = selectWalletPriceResult[0]['Reward']
  console.log("INVESTOR WALLET PRICE = " + investorWalletPrice);
  var currentCoinSymbolPrice = nomicsCoin.getPrice(buyCoinSymbol);
  console.log("CURRENT COIN PRICE = " + currentCoinSymbolPrice);
  var coinSymbolRank = nomicsCoin.getRank(buyCoinSymbol);
  console.log("COIN RANK = " + coinSymbolRank);
  var description = nomicsCoin.getDescription(buyCoinSymbol);
  const existingCoinSymbolsResult = con.query(`SELECT CoinSymbol FROM buycoin WHERE UserName = '${investorUsername}';`);
  var existingCoinSymbols = [];
  for (let i = 0; i < existingCoinSymbolsResult.length; i++) {
    existingCoinSymbols.push(existingCoinSymbolsResult[i]['CoinSymbol']);
  }
  console.log("EXISTING SYMBOLS IN DB = " + existingCoinSymbols);

  // LOGIC
  if (buyPriceFromInvestor > investorWalletPrice) {
    // NO SUFFICIENT BALANCE
    console.log("YOU DO NOT HAVE SUFFICIENT BALACE TO BUY THE COIN");
    res.render('investor/assets', {
      symbol: buyCoinSymbol,
      success: '',
      failure: 'Failed',
      portfolioPrice: investorWalletPrice,
      description: description
    })
  } else {
    // IF COIN SYMBOL ALREADY EXIST IN THE DB - WE NEED TO UPDATE THE COINQTY & BUYPRICE
    if (existingCoinSymbols.includes(buyCoinSymbol)) {
      console.log("COIN EXIST IN THE DB - PERFORM UPDATE OPERATION");
      // GET BUY PRICE & COIN QTY FROM DB THAT ALREADY EXISTS
      const symbolPriceQtyResult = con.query(`SELECT BuyPrice, CoinQty FROM buycoin WHERE CoinSymbol = '${buyCoinSymbol}' AND UserName = '${investorUsername}';`);
      var existingBuyPrice = 0;
      var existingCoinQty = 0;
      for (let i = 0; i < symbolPriceQtyResult.length; i ++) {
        existingBuyPrice += symbolPriceQtyResult[0]['BuyPrice'];
        existingCoinQty += symbolPriceQtyResult[0]['CoinQty'];
      }
      console.log("EXISTING BUY PRICE = " + existingBuyPrice);
      console.log("EXISTING COIN QTY = " + existingCoinQty);

      var coinQty = buyPriceFromInvestor / currentCoinSymbolPrice;
      var updatedCoinQty = existingCoinQty + coinQty;
      var updatedBuyPrice = existingBuyPrice + parseInt(buyPriceFromInvestor);

      console.log("UPDATED BUY PRICE = " + updatedBuyPrice);
      console.log("UPDATED COIN QTY = " + updatedCoinQty);

      const updateBuyCoinResult = con.query(`UPDATE buycoin SET BuyPrice = ${updatedBuyPrice}, CoinQty = ${updatedCoinQty}  WHERE CoinSymbol = '${buyCoinSymbol}' AND UserName = '${investorUsername}';`);
      if (updateBuyCoinResult.affectedRows > 0){
        console.log("Coin Purchased Successfully");
        var updatedInvestorWalletPrice = investorWalletPrice - buyPriceFromInvestor;
        const updateRewardResult = con.query(`UPDATE investors SET Reward = '${updatedInvestorWalletPrice}' WHERE UserName = '${investorUsername}';`);
        if (updateRewardResult.affectedRows > 0) {
          const insertOrders = con.query(`INSERT INTO orders (UserName, BuyOrSell, CoinSymbol, Price, Qty, CurrentTimeStamp) VALUES ('${investorUsername}', 'BUY', '${buyCoinSymbol}', ${buyPriceFromInvestor}, ${coinQty}, '${timestamp.getTimeStamp()}');`);
          console.log("UPDATED INVESTOR REWARD !");
          res.render('investor/assets', {
            symbol: buyCoinSymbol,
            success: 'Success',
            failure: '',
            portfolioPrice: updatedInvestorWalletPrice,
            description: description
          })
        } else {
          console.log("ERROR !");
        }
      } else {
        console.log("ERROR !");
        res.render('investor/assets', {
          symbol: buyCoinSymbol,
          success: '',
          failure: 'Failed',
          portfolioPrice: investorWalletPrice,
          description: description
        })
      }
    }
    // ELSE WE NEED TO PERFROM AN INSERT DB
    else {
      // BUY COIN =
      // 1. INSERT RECORD INTO DB - CALCULATE COIN QTY
      var coinQty = buyPriceFromInvestor / currentCoinSymbolPrice;
      const insertCoinQtyResult = con.query(`INSERT INTO buycoin (UserName, CoinSymbol, BuyPrice, CoinQty, rank) VALUES ('${investorUsername}', '${buyCoinSymbol}', '${buyPriceFromInvestor}', '${coinQty}', '${coinSymbolRank}')`);
      var updatedInvestorWalletPrice = investorWalletPrice - buyPriceFromInvestor;
      if (insertCoinQtyResult.affectedRows > 0) {
        // 2. UPDATE REWARD
        const updateRewardResult = con.query(`UPDATE investors SET Reward = '${updatedInvestorWalletPrice}' WHERE UserName = '${investorUsername}';`);
        if (updateRewardResult.affectedRows > 0) {
          const insertOrders = con.query(`INSERT INTO orders (UserName, BuyOrSell, CoinSymbol, Price, Qty, CurrentTimeStamp) VALUES ('${investorUsername}', 'BUY', '${buyCoinSymbol}', ${buyPriceFromInvestor}, ${coinQty}, '${timestamp.getTimeStamp()}');`);
          console.log("UPDATED INVESTOR REWARD !");
        } else {
          console.log("ERROR !");
        }
        res.render('investor/assets', {
          symbol: buyCoinSymbol,
          success: 'Success',
          failure: '',
          portfolioPrice: updatedInvestorWalletPrice,
          description: description
        })
        console.log("RECORDED INSERTED - BUY COIN SUCCESSFULL !");
      } else {
        console.log("ERROR !");
        res.render('investor/assets', {
          symbol: buyCoinSymbol,
          success: '',
          failure: 'Failed',
          portfolioPrice: investorWalletPrice,
          description: description
        })
      }
    }
  }
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

// 3. PORTFOLIO
app.get("/portfolio", (req, res) => {

  console.log("\nPORTFOLIO LOGS\n------------------------------------------------------------------------------------------------\n");
  const selectRewardResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}';`);
  var walletprice = selectRewardResult[0]['Reward'];
  const selectCoinSymbolResult = con.query(`SELECT CoinSymbol, BuyPrice, CoinQty FROM buycoin WHERE UserName = '${investorUsername}' ORDER BY rank ASC;`);
  var symbols = "";
  var qty = "";
  var buyPrice = "";
  var avgBuyPrice = "";
  var investedPrice = 0;
  for (let i = 0; i < selectCoinSymbolResult.length; i++) {
    symbols += selectCoinSymbolResult[i]['CoinSymbol'] + ",";
    investedPrice += selectCoinSymbolResult[i]['BuyPrice'];
    buyPrice += selectCoinSymbolResult[i]['BuyPrice'] + ",";
    qty += selectCoinSymbolResult[i]['CoinQty'] + ",";
    avgBuyPrice += (selectCoinSymbolResult[i]['BuyPrice'] / selectCoinSymbolResult[i]['CoinQty']).toFixed(2) + ",";
  }
  symbols = symbols.substring(0, symbols.length - 1);
  qty = qty.substring(0, qty.length - 1);
  buyPrice = buyPrice.substring(0, buyPrice.length - 1);
  console.log("PURCHASED COINS = " + symbols);
  console.log("BUY PRICES = " + buyPrice);
  console.log("PURCHASED QTY = " + qty);
  console.log("AVERAGE BUY PRICE = " + avgBuyPrice);
  console.log("TOTAL INVESTMENT = " + investedPrice);

  res.render('investor/portfolio', {
    symbols: symbols,
    prices: qty,
    investedPrice: investedPrice,
    walletprice: walletprice,
    buyPrice: buyPrice,
    avgBuyPrice: avgBuyPrice
  });
})
app.get("/sell", (req, res) => {

  console.log("\SELL COIN LOGS\n------------------------------------------------------------------------------------------------\n");
  console.log("SELL SYMBOL = " + req.originalUrl.split("=")[1]);
  var sellSymbol = req.originalUrl.split("=")[1];
  const rewardPriceResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}';`);
  console.log("PORTFOLIO PRICE = " + rewardPriceResult[0]['Reward']);
  var portfolioPrice = rewardPriceResult[0]['Reward'];
  const totalQtyResult = con.query(`SELECT CoinQty FROM buycoin WHERE CoinSymbol = '${sellSymbol}' AND UserName = '${investorUsername}';`);
  console.log("TOTAL QTY = " + totalQtyResult[0]['CoinQty']);
  var totalQty = totalQtyResult[0]['CoinQty'];
  res.render('investor/sell', {
    symbol : sellSymbol,
    success : '',
    failure: '',
    portfolioPrice: portfolioPrice,
    totalQty: totalQty
  });
})
app.post("/sell", (req, res) => {
  var sellPrice = req.body.price;
  var sellSymbol = req.body.symbol;
  console.log("SELL PRICE = " + sellPrice);
  console.log("SELL SYMBOL = " + sellSymbol);

  const coinQtyResult = con.query(`SELECT BuyPrice, CoinQty FROM buycoin WHERE UserName = '${investorUsername}' AND CoinSymbol = '${sellSymbol}';`)
  var coinQty = coinQtyResult[0]['CoinQty'];
  var buyPrice = coinQtyResult[0]['BuyPrice'];
  console.log("COIN QTY = " + coinQty);
  console.log("BUY PRICE = " + buyPrice);

  var currentPrice = nomicsCoin.getPrice(sellSymbol);
  var totalWorth = currentPrice * coinQty;
  console.log("CURRENT PRICE = " + currentPrice);
  console.log("TOTAL WORTH = " + totalWorth);

  var totalSellCoins = sellPrice / currentPrice;
  console.log("SELL COIN QTY = " + totalSellCoins);

  // IF INPUT PRICE IS MORE THAN THE TOTAL WORTH - YOU TOTAL WORTH IS LESS THAN THE INPUT PRICE - YOU CANNOT SELL THE COIN
  if (sellPrice > totalWorth) {
    console.log("Your Do not own Sufficient Coins to Sell");

    const rewardPriceResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}';`);
    console.log("PORTFOLIO PRICE = " + rewardPriceResult[0]['Reward']);
    var portfolioPrice = rewardPriceResult[0]['Reward'];
    const totalQtyResult = con.query(`SELECT CoinQty FROM buycoin WHERE CoinSymbol = '${sellSymbol}' AND UserName = '${investorUsername}';`);
    console.log("TOTAL QTY = " + totalQtyResult[0]['CoinQty']);
    var totalQty = totalQtyResult[0]['CoinQty'];

    res.render('investor/sell', {
      symbol : sellSymbol,
      success : '',
      failure: 'Failed',
      portfolioPrice: portfolioPrice,
      totalQty: totalQty
    });
  }
  // SELL THE COIN
  else {
    // CALCULATE THE COINS THAT THE USER WANTS TO SELL

    // Minus the CoinQty in the buycoin
    // Minus the BuyPrice in the buycoin
    // Create new table = sellCoin {UserName, CoinSymbol, SellPrice, CoinQty}
    // Update the Rewards
    var updatedBuyPrice = buyPrice - sellPrice;
    var updatedCoinQty = coinQty - totalSellCoins;
    const updateBuyCoinResult = con.query(`UPDATE buycoin SET BuyPrice = ${updatedBuyPrice}, CoinQty = ${updatedCoinQty}  WHERE CoinSymbol = '${sellSymbol}' AND UserName = '${investorUsername}';`);
    if (updateBuyCoinResult.affectedRows > 0) {
      console.log("BUY COIN TABLE SUCCESSFULLY UPDATED");
      // UPDATE REWARD
      const investorRewardResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}'`);
      var reward = investorRewardResult[0]['Reward'];
      var updatedReward = parseInt(reward) + parseInt(sellPrice);
      const updateBuyCoinResult = con.query(`UPDATE investors SET Reward = ${updatedReward} WHERE UserName = '${investorUsername}';`);
      if (updateBuyCoinResult.affectedRows > 0) {
        console.log("UPDATED THE INVESTORS REWARD");
        const insertOrders = con.query(`INSERT INTO orders (UserName, BuyOrSell, CoinSymbol, Price, Qty, CurrentTimeStamp) VALUES ('${investorUsername}', 'SELL', '${sellSymbol}', ${sellPrice}, ${totalSellCoins}, '${timestamp.getTimeStamp()}');`);
        const rewardPriceResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}';`);
        console.log("PORTFOLIO PRICE = " + rewardPriceResult[0]['Reward']);
        var portfolioPrice = rewardPriceResult[0]['Reward'];
        const totalQtyResult = con.query(`SELECT CoinQty FROM buycoin WHERE CoinSymbol = '${sellSymbol}' AND UserName = '${investorUsername}';`);
        console.log("TOTAL QTY = " + totalQtyResult[0]['CoinQty']);
        var totalQty = totalQtyResult[0]['CoinQty'];

        res.render('investor/sell', {
          symbol : sellSymbol,
          success : 'Success',
          failure: '',
          portfolioPrice: portfolioPrice,
          totalQty: totalQty
        });
      } else {

        const rewardPriceResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}';`);
        console.log("PORTFOLIO PRICE = " + rewardPriceResult[0]['Reward']);
        var portfolioPrice = rewardPriceResult[0]['Reward'];
        const totalQtyResult = con.query(`SELECT CoinQty FROM buycoin WHERE CoinSymbol = '${sellSymbol}' AND UserName = '${investorUsername}';`);
        console.log("TOTAL QTY = " + totalQtyResult[0]['CoinQty']);
        var totalQty = totalQtyResult[0]['CoinQty'];

        console.log("ERROR - UPDATING REWARD TABLE");
        res.render('investor/sell', {
          symbol : sellSymbol,
          success : '',
          failure: 'Failed',
          portfolioPrice: portfolioPrice,
          totalQty: totalQty
        });
      }
    } else {

      const rewardPriceResult = con.query(`SELECT Reward FROM investors WHERE UserName = '${investorUsername}';`);
      console.log("PORTFOLIO PRICE = " + rewardPriceResult[0]['Reward']);
      var portfolioPrice = rewardPriceResult[0]['Reward'];
      const totalQtyResult = con.query(`SELECT CoinQty FROM buycoin WHERE CoinSymbol = '${sellSymbol}' AND UserName = '${investorUsername}';`);
      console.log("TOTAL QTY = " + totalQtyResult[0]['CoinQty']);
      var totalQty = totalQtyResult[0]['CoinQty'];

      console.log("ERROR - UPDATING BUY COIN");
      res.render('investor/sell', {
        symbol : sellSymbol,
        success : '',
        failure: 'Failed',
        portfolioPrice: portfolioPrice,
        totalQty: totalQty
      });
    }

    // INSERT RECORD INTO THE SELL COIN TABLE
    const insertSellCoinResult = con.query(`INSERT INTO sellcoin (UserName, CoinSymbol, SellPrice, CoinQty) VALUES ('${investorUsername}', '${sellSymbol}', '${sellPrice}', '${totalSellCoins}');`);
    if (insertSellCoinResult.affectedRows > 0) {
      console.log("SUCCESSFULLY INSERTED");
    } else {
      console.log("COULD NOT INSERT RECORD INTO THE SELL COIN TABLE");
    }

  }
})

// 4. ORDERS
app.get("/orders", (req, res) => {
  const ordersResult = con.query(`SELECT * FROM orders WHERE UserName = '${investorUsername}'`);
  var buyOrSell = "";
  var coinSymbol = "";
  var price = "";
  var qty = "";
  var currentTimestamp = "";

  for (let i = 0; i < ordersResult.length; i++) {
    buyOrSell += ordersResult[i]['BuyOrSell'] + ",";
    coinSymbol += ordersResult[i]['CoinSymbol'] + ",";
    price += ordersResult[i]['Price'] + ",";
    qty += ordersResult[i]['Qty'] + ",";
    currentTimestamp += ordersResult[i]['CurrentTimeStamp'] + ",";
  }

  console.log(buyOrSell);
  console.log(coinSymbol);
  console.log(price);
  console.log(qty);
  console.log(currentTimestamp);

  res.render('investor/orders', {
    buyOrSell: buyOrSell,
    coinSymbol: coinSymbol,
    price: price,
    qty: qty,
    currentTimestamp: currentTimestamp
  })
})

// 5. GET INVESTOR LOGOUT
app.get("/logout", (req, res) => {
  res.render('home');
})

// *****************************************************************************

//ADMIN SECTION BEGIN *****

// GET ADMIN LOGIN PAGE
app.get("/admin", (req, res) => {
  res.render('admin/adminSign-In', {
    failure: ''
  })
})

// POST ADMIN LOGIN PAGE
app.post("/admin", (req, res) => {

  console.log("\ADMIN LOGIN LOGS\n------------------------------------------------------------------------------------------------\n");
  var username = req.body.uname;
  var password = req.body.psw;
  console.log("ADMIN USERNAME = " + username);
  console.log("ADMIN PASSWORD = " + password);
  const adminResult = con.query(`SELECT AdminName, Passwrd FROM admin WHERE AdminName = '${username}';`);
  if(adminResult.length == 1) {
    var dbUsername = adminResult[0]['AdminName'];
    var dbPassword = adminResult[0]['Passwrd'];
    console.log("DB USERNAME = " + dbUsername);
    console.log("DB PASSWORD = " + dbPassword);
    if (dbUsername == username && dbPassword == password) {
      console.log("LOGIN SUCCESS");
      res.redirect('/admindb');
    } else {
      res.render('admin/adminSign-In', {failure:'failure'})
      console.log("USERNAME DOESNOT EXIST");
    }
  } else {
    res.render('admin/adminSign-In', {failure:'failure'})
    console.log("USERNAME DOESNOT EXIST");
  }

})

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

  // 4. TOTAL SELL ORDERS
  const totalSellPriceResult = con.query(`SELECT SellPrice FROM sellcoin;`);
  var totalSellPrice = 0;
  for (let i = 0; i < totalSellPriceResult.length; i++) {
    totalSellPrice += totalSellPriceResult[i]['SellPrice'];
  }
  console.log("TOTAL SELL ORDERS = " + totalSellPrice);

  // 4. RECENT COIN LISTINGS
  const recentCoinListingResult = con.query(`SELECT CoinSymbol, CurrentTimeStamp FROM addcoin ORDER BY CurrentTimeStamp DESC LIMIT 5;`);
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
  const recentBuyOrdersResult = con.query(`SELECT UserName, BuyOrSell, CoinSymbol, Price FROM orders ORDER BY CurrentTimeStamp DESC LIMIT 5;`);
  var buyUsers = "";
  var buySymbols = "";
  var buyPrices = "";
  var buyorsell = "";
  var color = "";
  for (let i = 0; i < recentBuyOrdersResult.length; i++) {
    buyUsers += recentBuyOrdersResult[i]['UserName'] + ",";
    buySymbols += recentBuyOrdersResult[i]['CoinSymbol'] + ",";
    buyPrices += recentBuyOrdersResult[i]['Price'] + ",";
    buyorsell += recentBuyOrdersResult[i]['BuyOrSell'] + ",";
    if (recentBuyOrdersResult[i]['BuyOrSell'] == "BUY") {
      color += "lightgreen" + ",";
    } else {
      color += "red" + ",";
    }
  }
  var buyuser = buyUsers.substring(0, buyUsers.length - 1);
  var buysymbol = buySymbols.substring(0, buySymbols.length - 1);
  var buyPrice = buyPrices.substring(0, buyPrices.length - 1);
  var buyorsell = buyorsell.substring(0, buyorsell.length - 1);
  var color = color.substring(0, color.length - 1);
  console.log("RECENT BUY ORDERS");
  console.log("BUY USERS = " + buyuser);
  console.log("BUY SYMBOLS = " + buysymbol);
  console.log("BUY PRICES = " + buyPrice);
  console.log("BUY OR SELL = " + buyorsell);
  console.log("COLOR = " + color);

  res.render('admin/admin-dashboard', {
    totalPlatformCoins: totalPlatformCoins,
    totalRegistrationCount: totalRegistrationCount,
    totalBuyPrice: totalBuyPrice,
    totalSellPrice: totalSellPrice,
    symbols: symbols,
    timestamps: timestamps,
    buyuser: buyuser,
    buysymbol: buysymbol,
    buyPrice: buyPrice,
    buyorsell: buyorsell,
    color: color
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
      // * ADD COIN TO DB {PARAMS = COINSYMBOL, TIMESTAMP}
      // 1. GET COIN SYMBOL
      console.log("ADD SYMBOL FROM ADMIN = " + symbol);
      // CHECK AN API CALL {IF RETURN SUCCESS CONTINUE ; ELSE EXECUTES CATCH BLOCK}
      nomicsCoin.getPrice(symbol);
      // 2. GET CURRENT TIMESTAMP
      var currentTimestamp = timestamp.getTimeStamp();
      console.log("CURRENT TIMESTAMP = " + currentTimestamp);
      // 3. ADD TO DB
      const symbolInsertResult = con.query(`INSERT INTO addcoin (CoinSymbol, CurrentTimeStamp) VALUES ('${symbol}', '${currentTimestamp}')`);
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

// ANNOUNCEMENT SECTION
app.get("/announcement", (req, res) => {
  res.render('admin/announcement', {
    success: '',
    failure: ''
  });
})

app.post("/announcement", (req, res) => {
  // 1. ANNOUNCEMENT FROM ADMIN
  var announcement = req.body.announcement;
  console.log(announcement);
  // 2. GET CURRENT TIMESTAMP
  var currentTimestamp = timestamp.getTimeStamp();
  console.log("CURRENT TIMESTAMP = " + currentTimestamp);
  // 3. ADD TO DB
  const announcementInsertResult = con.query(`INSERT INTO announcements (Announcement, CurrentTimeStamp) VALUES ('${announcement}', '${currentTimestamp}')`);
  if (announcementInsertResult.affectedRows > 0) {
    res.render('admin/announcement', {success:'success', failure:'', successDel:'', failureDel:''});
  }
  else {
    res.render('admin/announcement', {success:'', failure:'failure', successDel:'', failureDel:''});
  }
})

// GET ADMIN LOGOUT
app.get("/adminlogout", (req, res) => {
  res.render('admin/adminSign-In', {
    failure: ''
  })
})

// START SERVER & LISTEN ON PORT 4438
app.listen(3000, function() {
  console.log("Server is running on port 3000.");
})

// LAST ADDED RECORD
// SELECT CoinSymbol FROM addcoin WHERE CurrentTimeStamp = (SELECT min(CurrentTimeStamp) FROM addcoin); ONLY 1 RECORD

// GET LATEST RECORDS WITHOUT USING // ID
// SELECT CoinSymbol FROM addcoin ORDER BY CurrentTimeStamp DESC LIMIT 5;

// ORDERS
// USERNAME - Buy/Sell - SYMBOL - PRICE - QTY - TIMESTAMP
// DB QUERY
/*
CREATE TABLE Orders (
	UserName VARCHAR(100),
	FOREIGN KEY (UserName) REFERENCES investors(UserName),
	BuyOrSell VARCHAR(20),
	CoinSymbol VARCHAR(20),
	FOREIGN KEY (CoinSymbol) REFERENCES addcoin(CoinSymbol),
	Price int,
	Qty float(10),
	CurrentTimeStamp VARCHAR(20)
);
*/
