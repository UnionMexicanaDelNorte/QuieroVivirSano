/*
* Copyright (c) 2015 Razeware LLC
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

import UIKit
import SafariServices

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
  
  var window: UIWindow?
  
  func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
    registerForPushNotifications(application)

    UITabBar.appearance().barTintColor = UIColor.themeGreenColor
    UITabBar.appearance().tintColor = UIColor.whiteColor()
    
    // Check if launched from notification
    // 1
    if let notification = (launchOptions as? [String: AnyObject])?[UIApplicationLaunchOptionsRemoteNotificationKey] as? [String: AnyObject] {
      // 2
      let aps = notification["aps"] as! [String: AnyObject]
      createNewNewsItem(aps)
      // 3
      if let tabController = window?.rootViewController as? UITabBarController {
        tabController.selectedIndex = 1
      }
    }
    
    return true
  }
  
  // MARK: Helpers
  func createNewNewsItem(notificationDictionary:[String: AnyObject]) -> NewsItem? {
    if let news = notificationDictionary["alert"] as? String,
      let url = notificationDictionary["link_url"] as? String {
        let date = NSDate()
        
        let newsItem = NewsItem(title: news, date: date, link: url)
        let newsStore = NewsStore.sharedStore
        newsStore.addItem(newsItem)
        
        NSNotificationCenter.defaultCenter().postNotificationName(NewsFeedTableViewController.RefreshNewsFeedNotification, object: self)
        return newsItem
    }
    return nil
  }
  
  // MARK: Register for push
  func registerForPushNotifications(application: UIApplication) {
    let viewAction = UIMutableUserNotificationAction()
    viewAction.identifier = "VIEW_IDENTIFIER"
    viewAction.title = "View"
    viewAction.activationMode = .Foreground

    let newsCategory = UIMutableUserNotificationCategory()
    newsCategory.identifier = "NEWS_CATEGORY"
    newsCategory.setActions([viewAction], forContext: .Default)

    let categories: Set<UIUserNotificationCategory> = [newsCategory]

    let notificationSettings = UIUserNotificationSettings(forTypes: [.Badge, .Sound, .Alert], categories: categories)
    application.registerUserNotificationSettings(notificationSettings)
  }

  func application(application: UIApplication, didRegisterUserNotificationSettings notificationSettings: UIUserNotificationSettings) {
    if notificationSettings.types != .None {
      application.registerForRemoteNotifications()
    }
  }
  
  func application(application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: NSData) {
    let tokenChars = UnsafePointer<CChar>(deviceToken.bytes)
    var tokenString = ""
    
    for i in 0..<deviceToken.length {
      tokenString += String(format: "%02.2hhx", arguments: [tokenChars[i]])
    }
    
    print("Device Token:", tokenString)
  }

  func application(application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: NSError) {
    print("Failed to register:", error)
  }
  
  // MARK: Handle notifications
  func application(application: UIApplication, didReceiveRemoteNotification userInfo: [NSObject : AnyObject], fetchCompletionHandler completionHandler: (UIBackgroundFetchResult) -> Void) {
    let aps = userInfo["aps"] as! [String: AnyObject]
    
    // 1
    if let contentAvaiable = aps["content-available"] as? NSString where contentAvaiable.integerValue == 1 {
      // Refresh Podcast
      // 2
      let podcastStore = PodcastStore.sharedStore
      podcastStore.refreshItems { didLoadNewItems in
        // 3
        completionHandler(didLoadNewItems ? .NewData : .NoData)
      }
    } else  {
      // News
      // 4
      createNewNewsItem(aps)
      completionHandler(.NewData)
    }
  }
  
  // MARK: Handle notification action
  func application(application: UIApplication, handleActionWithIdentifier identifier: String?, forRemoteNotification userInfo: [NSObject : AnyObject], completionHandler: () -> Void) {
    // 1
    let aps = userInfo["aps"] as! [String: AnyObject]
    
    // 2
    if let newsItem = createNewNewsItem(aps) {
      if let tabController = window?.rootViewController as? UITabBarController {
        tabController.selectedIndex = 1
      }
      
      // 3
      if identifier == "VIEW_IDENTIFIER", let url = NSURL(string: newsItem.link) {
        let safari = SFSafariViewController(URL: url)
        window?.rootViewController?.presentViewController(safari, animated: true, completion: nil)
      }
    }
    
    // 4
    completionHandler()
  }
}

