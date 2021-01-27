﻿/*
SAMPLE CODE NOTICE

THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED, 
OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.  
THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.  
NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
*/
-- Create database CardPaymentAccept
USE master;
GO

CREATE DATABASE CardPaymentAccept
GO

-- Create master key for encryption
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<UseStrongPasswordHere>';
GO

-- Create certifiate for encryption
-- Warning: You should immediately back up the certificate and the private key associated with the certificate. 
-- If the certificate ever becomes unavailable or if you must restore or attach the database on another server, 
-- you must have backups of both the certificate and the private key or you will not be able to open the database.
CREATE CERTIFICATE CardPaymentAcceptCert WITH SUBJECT = 'CardPaymentAccept DEK Certificate';
GO

-- Create encryption key and enable Transparent Data Encryption
USE CardPaymentAccept
GO

CREATE DATABASE ENCRYPTION KEY
WITH ALGORITHM = AES_256
ENCRYPTION BY SERVER CERTIFICATE CardPaymentAcceptCert;
GO

ALTER DATABASE CardPaymentAccept
SET ENCRYPTION ON;
GO

-- Create table COUNTRYORREGION
CREATE TABLE [dbo].[COUNTRYORREGION](
    [RECORDID] bigint NOT NULL IDENTITY(1,1),
    [TWOLETTERISOCODE] nvarchar(15) NOT NULL,
CONSTRAINT [PK_COUNTRYORREGION] PRIMARY KEY CLUSTERED
(
    [RECORDID]
),
CONSTRAINT [IX_COUNTRYORREGION_TWOLETTERISOCODE] UNIQUE NONCLUSTERED
(
   [TWOLETTERISOCODE]
)
) ON [PRIMARY]
GO

-- Create table COUNTRYORREGIONTRANSLATION
CREATE TABLE [dbo].[COUNTRYORREGIONTRANSLATION](
    [COUNTRYCODE] nvarchar(15) NOT NULL,
    [LOCALE] nvarchar(15) NOT NULL,
    [LONGNAME] nvarchar(255) NOT NULL,
    [RECORDID] bigint NOT NULL IDENTITY(1,1),
    [SHORTNAME] nvarchar(255) NOT NULL,
CONSTRAINT [PK_COUNTRYORREGIONTRANSLATION] PRIMARY KEY CLUSTERED
(
    [RECORDID]
),
CONSTRAINT [FK_COUNTRYORREGIONTRANSLATION_COUNTRYCODE] FOREIGN KEY ([COUNTRYCODE]) REFERENCES [dbo].[COUNTRYORREGION]
(
    [TWOLETTERISOCODE]
),
CONSTRAINT [IX_COUNTRYORREGIONTRANSLATION_TWOLETTERISOCODE] UNIQUE NONCLUSTERED
(
   [COUNTRYCODE], [LOCALE]
)
) ON [PRIMARY]
GO

-- Create table CARDPAYMENTENTRY
CREATE TABLE [dbo].[CARDPAYMENTENTRY](
    [ALLOWVOICEAUTHORIZATION] bit NOT NULL,
    [CARDTYPES] nvarchar(255) NOT NULL,
    [DEFAULTCARDHOLDERNAME] nvarchar(255),
    [DEFAULTCITY] nvarchar(255),
    [DEFAULTCOUNTRYCODE] nvarchar(15),
    [DEFAULTPOSTALCODE] nvarchar(15),
    [DEFAULTSTATEORPROVINCE] nvarchar(255),
    [DEFAULTSTREET1] nvarchar(255),
    [DEFAULTSTREET2] nvarchar(255),
    [ENTRYDATA] nvarchar(max) NOT NULL,
    [ENTRYID] uniqueidentifier NOT NULL,
    [ENTRYLOCALE] nvarchar(15) NOT NULL,
    [ENTRYUTCTIME] datetime NOT NULL,
    [HOSTPAGEORIGIN] nvarchar(255) NOT NULL,
    [INDUSTRYTYPE] nvarchar(255) NOT NULL,
    [RECORDID] bigint NOT NULL IDENTITY(1,1),
    [SERVICEACCOUNTID] nvarchar(255) NOT NULL,
	[SHOWSAMEASSHIPPINGADDRESS] bit NOT NULL,
    [SUPPORTCARDSWIPE] bit NOT NULL,
	[SUPPORTCARDTOKENIZATION] bit NOT NULL,
    [TRANSACTIONTYPE] nvarchar(255) NOT NULL,
    [USED] bit NOT NULL,
CONSTRAINT [PK_CARDPAYMENTENTRY] PRIMARY KEY CLUSTERED
(
    [RECORDID]
),
CONSTRAINT [FK_CARDPAYMENTENTRY_DEFAULTCOUNTRYCODE] FOREIGN KEY ([DEFAULTCOUNTRYCODE]) REFERENCES [dbo].[COUNTRYORREGION]
(
    [TWOLETTERISOCODE]
),
CONSTRAINT [IX_CARDPAYMENTENTRY_ENTRYID] UNIQUE NONCLUSTERED
(
   [ENTRYID]
)
) ON [PRIMARY]
GO

-- Create table CARDPAYMENTRESULT
-- with a foreigh to CARDPAYMENTENTRY on [ENTRYID] (1..1 TO 0..1)
CREATE TABLE [dbo].[CARDPAYMENTRESULT](
    [ENTRYID] uniqueidentifier NOT NULL,
    [RECORDID] bigint NOT NULL IDENTITY(1,1),
    [RETRIEVED] bit NOT NULL,
    [RESULTACCESSCODE] uniqueidentifier NOT NULL,
    [RESULTDATA] nvarchar(max) NOT NULL,
	[SERVICEACCOUNTID] nvarchar(255) NOT NULL,
CONSTRAINT [PK_CARDPAYMENTRESULT] PRIMARY KEY CLUSTERED
(
    [RECORDID]
),
CONSTRAINT [FK_CARDPAYMENTRESULT_ENTRYID] FOREIGN KEY ([ENTRYID]) REFERENCES [dbo].[CARDPAYMENTENTRY]
(
    [ENTRYID]
) ON DELETE CASCADE,
CONSTRAINT [IX_CARDPAYMENTRESULT_RESULTACCESSCODE] UNIQUE NONCLUSTERED
(
   [RESULTACCESSCODE]
),
CONSTRAINT [IX_CARDPAYMENTRESULT_ENTRYID] UNIQUE NONCLUSTERED
(
   [ENTRYID]
)
) ON [PRIMARY]
GO