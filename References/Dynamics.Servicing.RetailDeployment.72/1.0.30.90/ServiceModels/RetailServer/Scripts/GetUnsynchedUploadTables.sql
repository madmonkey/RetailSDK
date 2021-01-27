/*
	THIS CODE CHECKS WHETHER THIS CHANNELDB HAS P-JOB DATA THAT HASN'T BEEN YET UPLOADED TO AX.
	THE RESULT OF THIS SCRIPT IS A RESULT SET WITH A SINGLE TABLE THAT CONTAINS THE NAME OF THE TABLES THAT HAVE DATA NOT YET UPLOADED TO AX.
	IF SUCH TABLE IN THE RESULT SET HAS 0 ROWS, THEN THERE IS NO DATA TO BE UPLOADED TO AX.
*/
SET NOCOUNT ON
DECLARE @tableName NVARCHAR(MAX)
DECLARE @filterColumn NVARCHAR(MAX)
DECLARE @uploadedFilter BIGINT
DECLARE @count BIGINT
DECLARE @currentFilter BIGINT

DECLARE @sqlCmd NVARCHAR(MAX)
DECLARE @paramDef NVARCHAR(MAX)

DECLARE @OUTPUTRESULT TABLE ( TABLENAME NVARCHAR(MAX), LAST_SYNCED_REPLICATIONCOUNTER BIGINT NULL, LATEST_REPLICATIONCOUNTER BIGINT NULL)

IF (2 <> (SELECT COUNT(*) FROM sys.schemas WHERE name IN ('ax', 'crt')))
BEGIN
	PRINT 'CRT/AX schemas do not exist. No data to be synced'
END
ELSE
BEGIN
	-- Check if the table exists. This check ensures that the script does not fail in case the table has been dropped.
	IF OBJECT_ID('crt.TABLEREPLICATIONLOG') IS NOT NULL
	BEGIN
	DECLARE tableCursor CURSOR
		FOR
		(
			-- this query returns the greatest filtermax for each table successfully applied to AX, along with the replication column name and table name
			SELECT
				TABLENAME,
				FILTERMAX,
				(SELECT TOP 1 FILTERFIELDNAME FROM crt.TABLEREPLICATIONLOG ll WHERE l.TABLENAME = ll.TABLENAME AND l.FILTERMAX= ll.FILTERMAX) FILTERFIELDNAME
			FROM
			(
				SELECT TABLENAME, MAX(FILTERMAX) as FILTERMAX
				FROM crt.TABLEREPLICATIONLOG
				-- filter logs that were successfully applied (3 means applied)
				WHERE UPLOADSESSIONID IN (SELECT ID FROM crt.UPLOADSESSION WHERE STATUS = 3)
				GROUP BY TABLENAME		
			) l
		)
		
		OPEN tableCursor
		FETCH NEXT FROM tableCursor INTO @tableName, @uploadedFilter, @filterColumn
		
		IF @@FETCH_STATUS <> 0
		BEGIN
			PRINT 'No data is available for crt.TABLEREPLICATIONLOG associated with a successful (applied) CDX upload session'

			-- getting here means that there is no data for successful CDX runs
			-- if no data is present on a canary table (AX.RETAILTRANSACTIONTABLE pick due to representativeness), then we are satisfied that this channel DB has no data to be uploaded
			-- however, if the canary table has data, then we know there is data not yet synced to AX
			
			IF OBJECT_ID('AX.RETAILTRANSACTIONTABLE') IS NOT NULL
			BEGIN
				IF EXISTS (SELECT * FROM AX.RETAILTRANSACTIONTABLE)
				BEGIN
					PRINT 'There exists data on canary table (AX.RETAILTRANSACTIONTABLE)'
					INSERT INTO @OUTPUTRESULT (TABLENAME, LAST_SYNCED_REPLICATIONCOUNTER, LATEST_REPLICATIONCOUNTER)
									VALUES ('AX.RETAILTRANSACTIONTABLE', 0, (SELECT MAX(REPLICATIONCOUNTERFROMORIGIN) FROM AX.RETAILTRANSACTIONTABLE))
				END
				ELSE
				BEGIN
					PRINT 'There is no data on canary table (AX.RETAILTRANSACTIONTABLE)'
				END
			END
			ELSE
			BEGIN
				PRINT 'AX.RETAILTRANSACTIONTABLE does not exist.'
			END
		END
		ELSE
		BEGIN
			WHILE @@FETCH_STATUS = 0
			BEGIN
				SET @currentFilter = NULL

				-- if table exists, then query it for filter
				IF OBJECT_ID(@tableName) IS NOT NULL
				BEGIN
					-- Get current replication counter for each table
					SET @sqlCmd = 'SELECT @_currentFilter = MAX(CAST(' + @filterColumn + ' AS BIGINT)) FROM ' + @tableName
					SET @paramDef = '@_currentFilter BIGINT OUTPUT'
			
					PRINT 'Will execute the following query: ' + @sqlCmd
					EXEC sp_executesql @sqlCmd, @paramDef, @_currentFilter=@currentFilter OUTPUT;				
				END
				ELSE
				BEGIN
					PRINT @tableName + ' table does not exist. Assuming 0 as replication counter.'
				END
				
				SET @currentFilter = COALESCE(@currentFilter, 0)

				IF @currentFilter > @uploadedFilter
				BEGIN
					-- the current replication counter on the table is greater than what was uploaded to AX
					-- this means this table has data to be synced
					INSERT INTO @OUTPUTRESULT (TABLENAME, LAST_SYNCED_REPLICATIONCOUNTER, LATEST_REPLICATIONCOUNTER) VALUES (@tableName, @uploadedFilter, @currentFilter)
				END

				PRINT @tableName + ' has current filter of ' + cast(@currentFilter as varchar(100)) + ' and uploaded filter of ' + CAST(@uploadedFilter as VARCHAR(100))

				FETCH NEXT FROM tableCursor INTO @tableName, @uploadedFilter, @filterColumn
			END
		END

		CLOSE tableCursor
		DEALLOCATE tableCursor 

	END
	ELSE
	BEGIN
	  PRINT 'crt.TABLEREPLICATIONLOG does not exist. Skipping the check.'
	END
END

SELECT @count = COUNT(*) FROM @OUTPUTRESULT
PRINT 'There are ' + CAST(@count AS VARCHAR(100)) + ' tables that need to be synced to AX. Check result set for table names, if any.'

SELECT * FROM @OUTPUTRESULT