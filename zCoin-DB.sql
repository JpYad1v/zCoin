/*
SQLyog - Free MySQL GUI v5.19
Host - 5.0.15-nt : Database - zc
*********************************************************************
Server version : 5.0.15-nt
*/

SET NAMES utf8;

SET SQL_MODE='';

create database if not exists `zc`;

USE `zc`;

SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

/*Table structure for table `addcoin` */

DROP TABLE IF EXISTS `addcoin`;

CREATE TABLE `addcoin` (
  `CoinSymbol` varchar(255) NOT NULL default '',
  `CurrentTimeStamp` varchar(255) default NULL,
  `CoinID` int(11) default NULL,
  PRIMARY KEY  (`CoinSymbol`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `addcoin` */

insert into `addcoin` (`CoinSymbol`,`CurrentTimeStamp`,`CoinID`) values ('1INCH','Sun Jan 16 2022 9:57:48 AM',14),('ADA','Thu Dec 30 2021 8:58:30 PM',8),('BNB','Thu Dec 30 2021 8:55:54 PM',7),('BTC','Fri Dec 24 2021 11:20:26 PM',3),('COTI','Fri Dec 24 2021 11:32:37 PM',6),('DOGE','Fri Dec 24 2021 11:25:51 PM',5),('ETH','Fri Dec 24 2021 11:17:47 PM',2),('NEAR','Fri Jan 14 2022 6:55:53 PM',13),('POLY','Fri Dec 31 2021 10:02:57 PM',11),('RUNE','Fri Dec 31 2021 9:54:21 PM',9),('SAFEMOON','Fri Dec 31 2021 9:55:11 PM',10),('SOL','Thu Dec 30 2021 8:59:56 PM',9),('VLX','Fri Dec 31 2021 10:03:08 PM',12),('XRP','Sat Dec 25 2021 9:54:21 AM',7);

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `AdminName` varchar(20) default NULL,
  `Passwrd` varchar(20) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `admin` */

insert into `admin` (`AdminName`,`Passwrd`) values ('admin','admin');

/*Table structure for table `buycoin` */

DROP TABLE IF EXISTS `buycoin`;

CREATE TABLE `buycoin` (
  `UserName` varchar(255) default NULL,
  `CoinSymbol` varchar(255) default NULL,
  `BuyPrice` int(11) default NULL,
  `CoinQty` float default NULL,
  `rank` int(11) default NULL,
  `BuyCoinID` int(11) default NULL,
  KEY `UserName` (`UserName`),
  CONSTRAINT `buycoin_ibfk_1` FOREIGN KEY (`UserName`) REFERENCES `investors` (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `buycoin` */

insert into `buycoin` (`UserName`,`CoinSymbol`,`BuyPrice`,`CoinQty`,`rank`,`BuyCoinID`) values ('a','COTI',-4,0.0150125,194,1),('a','DOGE',-1,0.0642364,13,1),('a','XRP',0,0.00876619,9,1),('a','ADA',1,0.00860771,6,1),('HKumar','DOGE',0,0.00107106,13,1),('HKumar','ETH',-1,1.02447e-006,2,1),('a','POLY',344,9.23408,159,1),('a','VLX',1,0.0159084,112,1),('a','SOL',59,8.84662e-005,5,1),('Puneeth97','NEAR',1000,0.713632,17,1);

/*Table structure for table `investors` */

DROP TABLE IF EXISTS `investors`;

CREATE TABLE `investors` (
  `FirstName` varchar(255) default NULL,
  `UserName` varchar(255) NOT NULL default '',
  `Gender` varchar(255) default NULL,
  `EmailId` varchar(255) default NULL,
  `Passwrd` varchar(255) default NULL,
  `Reward` int(11) default NULL,
  PRIMARY KEY  (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `investors` */

insert into `investors` (`FirstName`,`UserName`,`Gender`,`EmailId`,`Passwrd`,`Reward`) values ('A','a','male','a@gmail.com','a',0),('B','B','female','b@gmail.com','b',50),('Gnaneshwari','Gnaneshwari','female','Gnaneshwari@gmail.com','Gnaneshwari',1000),('Guru Pradad','Guru1998','male','guru@gmail.com','PasswnotPasswd',1000),('Harindar Kumar','HKumar','male','HKumar@gmail.com','H@123',1001),('Jayanth','Jayanth','male','jayanth@gmail.com','Jayanth123',1000),('Jp Yadav','JpYadav98','male','Jp@gmail.com','Android_1998',400),('Kumari','Kumari','female','kumari@123','Kumari1998',0),('Pravin Kumar','PKumar','male','pKumar@gmail.com','pKumar!@#',1000),('Puneeth M','Puneeth97','male','Puneeth1997@gmail.com','Punith@123',0),('Punith Kumar','PunirhKumar','male','punithkumar@gmail.com','punithKumar!@#',1000),('tester','tester','male','tester@gmail.com','tester',1000),('Venkatesh B S','venky123','male','venkateshbs@gmail.com','Venky@123',1000);

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `UserName` varchar(100) default NULL,
  `BuyOrSell` varchar(20) default NULL,
  `CoinSymbol` varchar(20) default NULL,
  `Price` int(11) default NULL,
  `Qty` float default NULL,
  `CurrentTimeStamp` varchar(50) default NULL,
  KEY `UserName` (`UserName`),
  KEY `CoinSymbol` (`CoinSymbol`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserName`) REFERENCES `investors` (`UserName`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`CoinSymbol`) REFERENCES `addcoin` (`CoinSymbol`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `orders` */

insert into `orders` (`UserName`,`BuyOrSell`,`CoinSymbol`,`Price`,`Qty`,`CurrentTimeStamp`) values ('a','BUY','VLX',100,3.09374,'Mon Jan 03 2022 8:26:13 PM'),('a','BUY','VLX',50,1.54687,'Mon Jan 03 2022 8:26:34 PM'),('a','SELL','VLX',149,4.6247,'Mon Jan 03 2022 8:33:08 PM'),('a','BUY','SOL',400,0.0311409,'Tue Jan 04 2022 8:01:07 PM'),('Puneeth97','BUY','NEAR',1000,0.713632,'Fri Jan 14 2022 6:56:39 PM'),('a','SELL','SOL',341,0.0310524,'Sun Jan 16 2022 7:00:00 PM'),('a','BUY','POLY',343,9.21143,'Sun Jan 16 2022 7:04:23 PM');

/*Table structure for table `sellcoin` */

DROP TABLE IF EXISTS `sellcoin`;

CREATE TABLE `sellcoin` (
  `UserName` varchar(20) default NULL,
  `CoinSymbol` varchar(20) default NULL,
  `SellPrice` int(11) default NULL,
  `CoinQty` float default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `sellcoin` */

insert into `sellcoin` (`UserName`,`CoinSymbol`,`SellPrice`,`CoinQty`) values ('a','COTI',164,5.92114),('a','DOGE',101,7.80481),('a','ADA',299,2.96389),('a','XRP',40,0.637507),('HKumar','DOGE',100,7.79825),('HKumar','ETH',901,0.00324218),('a','VLX',149,4.6247),('a','SOL',341,0.0310524);

/*Table structure for table `watchlist` */

DROP TABLE IF EXISTS `watchlist`;

CREATE TABLE `watchlist` (
  `UserName` varchar(255) default NULL,
  `CoinSymbol` varchar(255) default NULL,
  KEY `UserName` (`UserName`),
  KEY `CoinSymbol` (`CoinSymbol`),
  CONSTRAINT `watchlist_ibfk_1` FOREIGN KEY (`UserName`) REFERENCES `investors` (`UserName`),
  CONSTRAINT `watchlist_ibfk_2` FOREIGN KEY (`CoinSymbol`) REFERENCES `addcoin` (`CoinSymbol`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `watchlist` */

insert into `watchlist` (`UserName`,`CoinSymbol`) values ('a','ETH'),('a','NEAR'),('a','POLY');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
