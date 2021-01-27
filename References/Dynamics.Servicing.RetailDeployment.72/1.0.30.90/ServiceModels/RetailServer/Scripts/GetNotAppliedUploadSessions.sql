/*
	THIS CODE CHECKS WHEATHER THE AXDB HAS UPLOAD SESSIONS, ASSOCIATED WITH THE CLOUD CHANNEL DB, THAT ARE EITHER FAILED OR NOT YET COMPLETED (APPLIED) WITH THE TRANSACTION PURGE PERIOD.
	A upload session could be in the following states:
		0-2 (started, available, uploaded) - this means that the data is not yet commited to the AX DB
		3 (applied) - the data is commited to AX DB
		4 (cancelled) - the session was cancelled. Read more about this below.
		5-7 (upload-failed, apply-failed, read-failed) - some sort of failure has occured.

	A cancelled session (4) could be mark for rerun but it hasn't yet been rerun (Rerun == 1 (marked)) or marked for rerun and already reran (Rerun == 2 (executeD)).
	A cancelled session not marked for rerun or not reran, can be ignored (by definition).
	A session that was rerun (Rerun = 2) will always have a session newer than it containing the data for the rerun, whether successful or not. It sufices to analyze that newer sesion.
	A session that was marked for rerun but not yet rerun is equivalent to a new session on states 0-2, this is, the data associated to that session is not yet commited to the AXDB.

	This script will return:
		* Any sessions in states 0-2 or 5-7, within the transaction purge period
		* Any sessions in state 4, with Rerun = 1, within the transaction purge period	
*/
SET NOCOUNT ON
DECLARE @count BIGINT
DECLARE @dataStore BIGINT
DECLARE @retentionDays BIGINT
DECLARE @retentionStartDate DATETIME

DECLARE @OUTPUTRESULT TABLE ( UPLOADSESSIONID BIGINT, STATE INT, DESCRIPTION NVARCHAR(MAX) )

IF OBJECT_ID('dbo.RETAILCDXUPLOADSESSION') IS NULL
BEGIN
	PRINT 'dbo.RETAILCDXUPLOADSESSION does not exist. CDX is not present on this environment.'
END
ELSE
BEGIN
	-- check if column for transaction purge period exists
	-- if so, take the longest period as the retention period (taking the max is being conservative, because we cover more upload sessions)	
	IF COL_LENGTH('dbo.RETAILFUNCTIONALITYPROFILE', 'DAYSTRANSACTIONSEXISTS') IS NOT NULL
	BEGIN
		SELECT @retentionDays = MAX(COALESCE(DAYSTRANSACTIONSEXISTS, 0)) FROM dbo.RETAILFUNCTIONALITYPROFILE
		PRINT 'Retrieving retention days from dbo.RETAILFUNCTIONALITYPROFILE: ' + CAST(@retentionDays as varchar(100))
	END
	
	-- if that is not available, default to 120 days (4 months)
	-- also limit the period to 120 days if it is undefined or 0
	SET @retentionDays = COALESCE(@retentionDays, 120)
	IF @retentionDays <= 0 SET @retentionDays = 120
	SET @retentionStartDate = DATEADD(d, -@retentionDays, GETUTCDATE())
	PRINT 'Retention days is ' + CAST(@retentionDays as varchar(100)) + ' days and cut off date is ' + CONVERT(VARCHAR, @retentionStartDate, 120)

	-- this is used to filter upload session for the cloud channel DB only
	SELECT @dataStore = RECID FROM dbo.RETAILCONNDATABASEPROFILE WHERE NAME = 'DEFAULT'

	INSERT INTO @OUTPUTRESULT (UPLOADSESSIONID, STATE, DESCRIPTION)

    	-- returns sessions in progress
	    SELECT UPLOADSESSIONID, 1, 'InProgress' FROM dbo.RETAILCDXUPLOADSESSION
	    WHERE
            DATASTORE = @dataStore
		    AND STATUS IN (0, 1, 2)
		    AND CREATEDDATETIME >= @retentionStartDate
	
        UNION ALL

	    SELECT UPLOADSESSIONID, 2, 'Failed' FROM dbo.RETAILCDXUPLOADSESSION
	    WHERE
            DATASTORE = @dataStore
		    AND STATUS IN (5, 6, 7)
		    AND CREATEDDATETIME >= @retentionStartDate

	    UNION ALL

	    -- return sessions that were marked for rerun but not yet rerun
	    SELECT UPLOADSESSIONID, 3, 'Marked for rerun, but not run' FROM dbo.RETAILCDXUPLOADSESSION
	    WHERE
            DATASTORE = @dataStore
		    AND RERUN = 1
		    AND CREATEDDATETIME >= @retentionStartDate

END

SELECT @count = COUNT(*) FROM @OUTPUTRESULT
PRINT 'There are ' + CAST(@count AS VARCHAR(100)) + ' sessions that need attention. Please check the result set, if applicable.'

SELECT * FROM @OUTPUTRESULT
