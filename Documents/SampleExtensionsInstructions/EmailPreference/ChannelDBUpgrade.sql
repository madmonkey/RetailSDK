/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

-- Create the extension table to store the custom fields.

IF (SELECT OBJECT_ID('[ext].RETAILCUSTPREFERENCE')) IS NULL 
BEGIN
    CREATE TABLE [ext].[RETAILCUSTPREFERENCE](
        [DATAAREAID] [nvarchar](4) NOT NULL,
        [RECID] [bigint] NOT NULL,
        [EMAILOPTIN] [int] NOT NULL,
        [ACCOUNTNUM] [nvarchar](20) NOT NULL,
     CONSTRAINT [I_RETAILCUSTPREFERENCE_RECID] PRIMARY KEY CLUSTERED 
    (
        [RECID] ASC
    )WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
    ) ON [PRIMARY]

    ALTER TABLE [ext].[RETAILCUSTPREFERENCE] WITH CHECK ADD CHECK  (([RECID]<>(0)))
    ALTER TABLE [ext].[RETAILCUSTPREFERENCE] ADD DEFAULT ('dat') FOR [DATAAREAID]
    ALTER TABLE [ext].[RETAILCUSTPREFERENCE] ADD DEFAULT ((0)) FOR [EMAILOPTIN]
    ALTER TABLE [ext].[RETAILCUSTPREFERENCE] ADD DEFAULT ('') FOR [ACCOUNTNUM]
END
GO

GRANT SELECT, INSERT, UPDATE, DELETE ON OBJECT::[ext].[RETAILCUSTPREFERENCE] TO [DataSyncUsersRole]
GO

-- Create the extension table type to store the extension properties.

CREATE TYPE [ext].EXTENSIONPROPERTIESTABLETYPE AS TABLE
(
    PARENTRECID BIGINT NOT NULL,
    PROPERTYNAME NVARCHAR(512) NOT NULL,
    PROPERTYVALUE NVARCHAR(512)
)

GO

GRANT EXECUTE ON TYPE::[ext].EXTENSIONPROPERTIESTABLETYPE TO [UsersRole];
GO

-- Create the extension view that is accessed by CRT to query the custom fields.

IF OBJECT_ID(N'[ext].[CUSTOMEREXTENSIONVIEW]', N'V') IS NOT NULL
    DROP VIEW [ext].[CUSTOMEREXTENSIONVIEW]
GO

CREATE VIEW [ext].[CUSTOMEREXTENSIONVIEW] AS
(
    SELECT ACCOUNTNUM, DATAAREAID, EMAILOPTIN FROM [ext].RETAILCUSTPREFERENCE
)
GO

GRANT SELECT ON [ext].[CUSTOMEREXTENSIONVIEW] TO [UsersRole];
GO

GRANT SELECT ON [ext].[CUSTOMEREXTENSIONVIEW] TO [DeployExtensibilityRole];
GO

-- Create the extension stored procedure that is used by CRT to upsert the custom fields.

IF OBJECT_ID(N'[ext].[UPDATECUSTOMEREXTENSIONPROPERTIES]', N'P') IS NOT NULL
    DROP PROCEDURE [ext].[UPDATECUSTOMEREXTENSIONPROPERTIES]
GO

CREATE PROCEDURE [ext].[UPDATECUSTOMEREXTENSIONPROPERTIES]
    @TVP_EXTENSIONPROPERTIESTABLETYPE [ext].EXTENSIONPROPERTIESTABLETYPE READONLY
AS
BEGIN
    MERGE INTO [ext].RETAILCUSTPREFERENCE
    USING (SELECT DISTINCT tp.PARENTRECID, ct.DATAAREAID, tp.PROPERTYVALUE as [EMAILOPTIN], ct.ACCOUNTNUM
        FROM @TVP_EXTENSIONPROPERTIESTABLETYPE tp
        JOIN [ax].CUSTTABLE ct on ct.RECID = tp.PARENTRECID
        WHERE tp.PARENTRECID <> 0 AND tp.PROPERTYNAME = 'EMAILOPTIN') AS SOURCE
    ON
        [ext].RETAILCUSTPREFERENCE.RECID = SOURCE.PARENTRECID
        AND [ext].RETAILCUSTPREFERENCE.DATAAREAID = SOURCE.DATAAREAID
        AND [ext].RETAILCUSTPREFERENCE.ACCOUNTNUM = SOURCE.ACCOUNTNUM
    WHEN MATCHED THEN 
        UPDATE SET [EMAILOPTIN] = SOURCE.[EMAILOPTIN]
    WHEN NOT MATCHED THEN
        INSERT
        (
             RECID
            ,DATAAREAID
            ,EMAILOPTIN
            ,ACCOUNTNUM
        )
        VALUES
        (
             SOURCE.PARENTRECID
            ,SOURCE.DATAAREAID
            ,SOURCE.EMAILOPTIN
            ,SOURCE.ACCOUNTNUM
        );
    
END;
GO

GRANT EXECUTE ON [ext].[UPDATECUSTOMEREXTENSIONPROPERTIES] TO [UsersRole];
GO

GRANT EXECUTE ON [ext].[UPDATECUSTOMEREXTENSIONPROPERTIES] TO [PublishersRole];
GO

GRANT EXECUTE ON [ext].[UPDATECUSTOMEREXTENSIONPROPERTIES] TO [DeployExtensibilityRole];
GO