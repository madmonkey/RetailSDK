/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

import { IShowJournalTransactionListColumn } from "PosApi/Extend/Views/ShowJournalView";
import { ICustomColumnsContext } from "PosApi/Extend/Views/CustomListColumns";
import { DateFormatter, TransactionTypeFormatter, CurrencyFormatter } from "PosApi/Consume/Formatters";
import { ProxyEntities } from "PosApi/Entities";

class TransactionListColumns {
    private _context: ICustomColumnsContext;

    constructor(context: ICustomColumnsContext) {
        this._context = context;
    }

    /**
     * Gets the transaction list columns collection.
     * @returns {IShowJournalTransactionListColumn[]} The transaction list columns collection.
     */
    public get columns(): IShowJournalTransactionListColumn[] {
        let columns: IShowJournalTransactionListColumn[] = [
            {
                title: this._context.resources.getString("OperatorIdColumnName"),
                computeValue: (row: ProxyEntities.Transaction): string => row.StaffId,
                ratio: -1,
                collapseOrder: -1,
                minWidth: 100
            },
            {
                title: this._context.resources.getString("RegisterColumnName"),
                computeValue: (row: ProxyEntities.Transaction): string => row.TerminalId,
                ratio: -1,
                collapseOrder: -1,
                minWidth: 100
            },
            {
                title: this._context.resources.getString("TypeColumnName"),
                computeValue: (row: ProxyEntities.Transaction): string => TransactionTypeFormatter.toName(row.TransactionTypeValue),
                ratio: -1,
                collapseOrder: -1,
                minWidth: 100
            },
            {
                title: this._context.resources.getString("TotalColumnName"),
                computeValue: (row: ProxyEntities.Transaction): string => CurrencyFormatter.toCurrency(row.TotalAmount),
                ratio: -1,
                collapseOrder: -1,
                minWidth: 100
            },
            {
                title: this._context.resources.getString("ReceiptColumnName"),
                computeValue: (row: ProxyEntities.Transaction): string => row.ReceiptId,
                ratio: -1,
                collapseOrder: -1,
                minWidth: 100
            },
            {
                title: this._context.resources.getString("DateColumnName"),
                computeValue: (row: ProxyEntities.Transaction): string => DateFormatter.toShortDateAndTime(row.CreatedDateTime),
                ratio: -1,
                collapseOrder: -1,
                minWidth: 100
            },
            {
                title: this._context.resources.getString("ServiceChargeAmountColumnName"),
                computeValue: (row: ProxyEntities.Transaction): string => {
                    let value: ProxyEntities.CommercePropertyValue = this.getPropertyValue(row.ExtensionProperties, "ServiceChargeAmount");
                    let decimalValue: number = (value && value.DecimalValue) ? value.DecimalValue : 0;
                    return CurrencyFormatter.toCurrency(decimalValue);
                },
                ratio: -1,
                collapseOrder: -1,
                minWidth: 100
            },
            {
                title: this._context.resources.getString("ReturnRemainingDaysColumnName"),
                computeValue: (row: ProxyEntities.Transaction): string => {
                    let value: ProxyEntities.CommercePropertyValue = this.getPropertyValue(row.ExtensionProperties, "ReturnRemainingDays");
                    return (value && value.IntegerValue) ? value.IntegerValue.toString() : this._context.resources.getString("NotAvailableMessage");
                },
                ratio: -1,
                collapseOrder: -1,
                minWidth: 100
            }
        ];

        columns.forEach((column: IShowJournalTransactionListColumn, index: number) => {
            column.collapseOrder = index + 1;
            column.ratio = (100 / columns.length);
            column.isRightAligned = (index === (columns.length - 1));
        });

        return columns;
    }

    /**
     * Gets the property value given the column name.
     * @param {ProxyEntities.CommerceProperty[]} extensionProperties The extension properties collection.
     * @param {string} column The column name of the property value to be retrieved.
     * @returns The property value.
     */
    private getPropertyValue(extensionProperties: ProxyEntities.CommerceProperty[], column: string): ProxyEntities.CommercePropertyValue {
        let prop: ProxyEntities.CommerceProperty = (extensionProperties || []).filter((prop: ProxyEntities.CommerceProperty) => prop.Key === column)[0];
        return prop ? prop.Value : undefined;
    }
}

export default (context: ICustomColumnsContext): IShowJournalTransactionListColumn[] => {
    let transactionListColumns: TransactionListColumns = new TransactionListColumns(context);
    return transactionListColumns.columns;
};