/**
 * SAMPLE CODE NOTICE
 * 
 * THIS SAMPLE CODE IS MADE AVAILABLE AS IS.  MICROSOFT MAKES NO WARRANTIES, WHETHER EXPRESS OR IMPLIED,
 * OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY OR COMPLETENESS OF RESPONSES, OF RESULTS, OR CONDITIONS OF MERCHANTABILITY.
 * THE ENTIRE RISK OF THE USE OR THE RESULTS FROM THE USE OF THIS SAMPLE CODE REMAINS WITH THE USER.
 * NO TECHNICAL SUPPORT IS PROVIDED.  YOU MAY NOT DISTRIBUTE THIS CODE UNLESS YOU HAVE A LICENSE AGREEMENT WITH MICROSOFT THAT ALLOWS YOU TO DO SO.
 */

namespace Contoso
{
    namespace RetailServer.TestClient
    {
        using System;
        using System.Windows.Forms;
        using Microsoft.Dynamics.Commerce.RetailProxy;

        /// <summary>
        /// Main program.
        /// </summary>
        public static class Program
        {
            /// <summary>
            /// The main entry point for the application.
            /// </summary>
            [STAThread]
            public static void Main()
            {
                RetailServerContext.Initialize(new IEdmModelExtension[]
                {
                    /* BEGIN SDKSAMPLE_CROSSLOYALTY

                    new Contoso.Commerce.RetailProxy.CrossLoyaltySample.EdmModel(),

                    // END SDKSAMPLE_CROSSLOYALTY */

                    /* BEGIN SDKSAMPLE_STOREHOURS

                    new Contoso.Commerce.RetailProxy.StoreHoursSample.EdmModel(),

                    // END SDKSAMPLE_STOREHOURS */
                });

                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new MainForm());
            }
        }
    }
}