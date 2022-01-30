/*
SQLyog Community v13.1.7 (64 bit)
MySQL - 5.0.15-nt : Database - zc
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`zc` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `zc`;

/*Table structure for table `addcoin` */

DROP TABLE IF EXISTS `addcoin`;

CREATE TABLE `addcoin` (
  `CoinSymbol` varchar(255) NOT NULL default '',
  `CurrentTimeStamp` varchar(255) default NULL,
  PRIMARY KEY  (`CoinSymbol`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `addcoin` */

insert  into `addcoin`(`CoinSymbol`,`CurrentTimeStamp`) values 
('DOGE','Sun Jan 30 2022 5:38:27 PM'),
('SA','Sun Jan 30 2022 5:40:13 PM'),
('SHIB','Sun Jan 30 2022 5:39:16 PM'),
('TRX','Sun Jan 30 2022 5:39:44 PM'),
('VET','Sun Jan 30 2022 5:39:25 PM');

/*Table structure for table `admin` */

DROP TABLE IF EXISTS `admin`;

CREATE TABLE `admin` (
  `AdminName` varchar(20) default NULL,
  `Passwrd` varchar(20) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `admin` */

insert  into `admin`(`AdminName`,`Passwrd`) values 
('admin','admin');

/*Table structure for table `announcements` */

DROP TABLE IF EXISTS `announcements`;

CREATE TABLE `announcements` (
  `Announcement` varchar(255) default NULL,
  `CurrentTimeStamp` varchar(100) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `announcements` */

insert  into `announcements`(`Announcement`,`CurrentTimeStamp`) values 
('New Coin Listing on 05-02-2022 : XRP !','Sun Jan 30 2022 6:35:32 PM'),
('Reward 100 Loading - 07-02-2022','Sun Jan 30 2022 6:43:45 PM');

/*Table structure for table `buycoin` */

DROP TABLE IF EXISTS `buycoin`;

CREATE TABLE `buycoin` (
  `UserName` varchar(255) default NULL,
  `CoinSymbol` varchar(255) default NULL,
  `BuyPrice` int(11) default NULL,
  `CoinQty` float default NULL,
  `rank` int(11) default NULL,
  KEY `UserName` (`UserName`),
  CONSTRAINT `buycoin_ibfk_1` FOREIGN KEY (`UserName`) REFERENCES `investors` (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `buycoin` */

insert  into `buycoin`(`UserName`,`CoinSymbol`,`BuyPrice`,`CoinQty`,`rank`) values 
('a','TRX',50,11.0717,27),
('a','SA',60,27.4662,634),
('a','VET',400,97.2186,39),
('a','DOGE',400,37.385,12),
('cb','DOGE',100,9.32608,12),
('cb','TRX',0,0.00133086,27);

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

insert  into `investors`(`FirstName`,`UserName`,`Gender`,`EmailId`,`Passwrd`,`Reward`) values 
('A','a','male','a@gmail.com','a',90),
('B','B','female','b@gmail.com','b',50),
('cb','cb','male','cb@gmail.com','cb',1000),
('Gnaneshwari','Gnaneshwari','female','Gnaneshwari@gmail.com','Gnaneshwari',1000),
('Guru Pradad','Guru1998','male','guru@gmail.com','PasswnotPasswd',1000),
('Harindar Kumar','HKumar','male','HKumar@gmail.com','H@123',1001),
('Jayanth','Jayanth','male','jayanth@gmail.com','Jayanth123',1000),
('Jp Yadav','JpYadav98','male','Jp@gmail.com','Android_1998',400),
('Kumari','Kumari','female','kumari@123','Kumari1998',0),
('Pravin Kumar','PKumar','male','pKumar@gmail.com','pKumar!@#',1000),
('Puneeth M','Puneeth97','male','Puneeth1997@gmail.com','Punith@123',300),
('Punith Kumar','PunirhKumar','male','punithkumar@gmail.com','punithKumar!@#',1000),
('tester','tester','male','tester@gmail.com','tester',1000),
('Venkatesh B S','venky123','male','venkateshbs@gmail.com','Venky@123',1000),
('Vinayak','Vinayak','male','vinayak@gmail.com','Vinayak',0);

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

insert  into `orders`(`UserName`,`BuyOrSell`,`CoinSymbol`,`Price`,`Qty`,`CurrentTimeStamp`) values 
('a','BUY','TRX',100,22.1355,'Sun Jan 30 2022 5:45:08 PM'),
('a','SELL','TRX',50,11.0638,'Sun Jan 30 2022 5:48:24 PM'),
('a','BUY','SA',60,27.4662,'Sun Jan 30 2022 6:21:02 PM'),
('a','BUY','VET',400,97.2186,'Sun Jan 30 2022 6:21:30 PM'),
('a','BUY','DOGE',400,37.385,'Sun Jan 30 2022 6:22:08 PM'),
('cb','BUY','TRX',50,11.0486,'Sun Jan 30 2022 7:10:38 PM'),
('cb','SELL','TRX',50,11.0473,'Sun Jan 30 2022 7:12:22 PM');

/*Table structure for table `sellcoin` */

DROP TABLE IF EXISTS `sellcoin`;

CREATE TABLE `sellcoin` (
  `UserName` varchar(20) default NULL,
  `CoinSymbol` varchar(20) default NULL,
  `SellPrice` int(11) default NULL,
  `CoinQty` float default NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `sellcoin` */

insert  into `sellcoin`(`UserName`,`CoinSymbol`,`SellPrice`,`CoinQty`) values 
('a','TRX',50,11.0638),
('cb','TRX',50,11.0473);

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

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
