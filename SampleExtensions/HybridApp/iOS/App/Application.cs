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
    namespace Commerce.Client.Pos
    {
        using System;
        using Foundation;
        using UIKit;

        /// <summary>
        /// Encapsulates the application delegate.
        /// </summary>
        [Register(Application.Name)]
        public partial class Application : UIApplicationDelegate
        {
            private const string Name = "AppDelegate";
            private const string CloudPosUrlSetting = "CloudPosUrl";

            private UIWindow window;
            private PosViewController posViewController;
            private string cloudPosUrl;

            /// <summary>
            /// Main entry point of the application.
            /// </summary>
            /// <param name="args">The arguments.</param>
            public static void Main(string[] args)
            {
                UIApplication.Main(args, null, Application.Name);
            }

            /// <summary>
            /// Gets the localized string.
            /// </summary>
            /// <param name="resourceId">The resource identifier.</param>
            /// <returns>
            /// The localized string.
            /// </returns>
            public static string GetLocalizedString(string resourceId)
            {
                var @default = string.Format("Localized string not found '{0}'", resourceId);

                return NSBundle.MainBundle.GetLocalizedString(resourceId, @default, string.Empty);
            }

            /// <summary>
            /// Called when the application launching is finished.
            /// </summary>
            /// <param name="application">The application.</param>
            /// <param name="launchOptions">The launch options.</param>
            /// <returns>
            /// True to continue launching, false otherwise.
            /// </returns>
            public override bool FinishedLaunching(UIApplication application, NSDictionary launchOptions)
            {
                this.posViewController = new PosViewController();

                this.window = new UIWindow(UIScreen.MainScreen.Bounds)
                {
                    RootViewController = new UINavigationController(this.posViewController)
                };
                this.window.MakeKeyAndVisible();

                return true;
            }

            /// <summary>
            /// Called when the application is launched and every time the app returns to the foreground.
            /// </summary>
            /// <param name="application">Reference to the UIApplication that invoked this delegate method.</param>
            public override void OnActivated(UIApplication application)
            {
                var cloudPosUrlInSettings = NSUserDefaults.StandardUserDefaults.StringForKey(CloudPosUrlSetting);

                if (cloudPosUrlInSettings == null
                    || !string.Equals(this.cloudPosUrl, cloudPosUrlInSettings, StringComparison.Ordinal))
                {
                    this.cloudPosUrl = cloudPosUrlInSettings;
                    this.posViewController.Browse(this.cloudPosUrl);
                }
            }
        }
    }
}