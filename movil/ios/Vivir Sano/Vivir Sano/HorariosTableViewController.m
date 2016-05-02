//
//  HorariosTableViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 01/04/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "HorariosTableViewController.h"
#import "AppDelegate.h"
@interface HorariosTableViewController ()

@end

@implementation HorariosTableViewController
@synthesize horarios=_horarios,barEditing=_barEditing;
-(void)actualizaLaTabla
{
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    load = [LoadingView loadingViewInView:self.view];
    if (app.hasInternet)
    {
        dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
            NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
            NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
            NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
            NSString *correo = [defaults objectForKey:@"correoActual"];
            
            NSString *post = [NSString stringWithFormat:@"servicio=app&accion=getHorarios&correo=%@",correo];
            NSData *postData = [post dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
            
            NSString *postLength = [NSString stringWithFormat:@"%d", (int)[postData length]];
            
            
            NSCharacterSet *set = [NSCharacterSet URLQueryAllowedCharacterSet];
            
            NSString* encodedUrl = [urlString stringByAddingPercentEncodingWithAllowedCharacters:
                                    set];
            NSURL * url = [NSURL URLWithString:encodedUrl];
            NSMutableURLRequest * urlRequest = [NSMutableURLRequest requestWithURL:url];
            [urlRequest setHTTPMethod:@"POST"];//GET
            [urlRequest setValue:postLength forHTTPHeaderField:@"Content-Length"];
            [urlRequest setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
            
            [urlRequest setHTTPBody:postData];
            NSURLSessionDataTask * dataTask =[defaultSession dataTaskWithRequest:urlRequest                                                               completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
            //    NSLog(@"%@",[error description]);
                if(error == nil)
                {
                    NSError* error;
                    NSDictionary* json = [NSJSONSerialization
                                          JSONObjectWithData:data
                                          options:kNilOptions
                                          error:&error];
                    int success = [[json objectForKey:@"success"] intValue];
                    
                    if(success==1)
                    {
                        _horarios = [json objectForKey:@"horarios"];
                        [self.tableView reloadData];
                    }
                    else
                    {
                    }
                }
                [load removeView];
            }];
            
            [dataTask resume];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                // Code to update the UI/send notifications based on the results of the background processing
                //            [_message show];
                
                
            });
        });
        
    }
    else
    {
        [self showNoHayInternet];
    }

}
-(void)showNoHayInternet
{
    UIAlertController * view=   [UIAlertController
                                 alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                 message:NSLocalizedString(@"noHayInternet", nil)
                                 preferredStyle:UIAlertControllerStyleAlert];
    UIAlertAction* cancel = [UIAlertAction
                             actionWithTitle:NSLocalizedString(@"Aceptar", nil)
                             style:UIAlertActionStyleDefault
                             handler:^(UIAlertAction * action)
                             {
                                 [view dismissViewControllerAnimated:YES completion:nil];
                             }];
    [view addAction:cancel];
    [self presentViewController:view animated:YES completion:nil];
}
-(void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    _horarios = [[NSMutableArray alloc] init];
    
    [self actualizaLaTabla];
}
- (void)viewDidLoad {
    [super viewDidLoad];
    self.title=NSLocalizedString(@"horarios", @"");
   // self.navigationItem.rightBarButtonItem=self.editButtonItem;
    
}
-(IBAction)editAction:(UIBarButtonItem *)sender {
    //[self performSegueWithIdentifier:@"vesAAnadirHorario" sender:nil];
    if(self.tableView.isEditing)
    {
        //_barEditing = self.editButtonItem;
        [sender setTitle:@"Edit"];
        self.tableView.editing=NO;
    }
    else
    {
        [sender setTitle:@"Done"];
        self.tableView.editing=YES;
    }
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return _horarios.count;
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"horariosCell" forIndexPath:indexPath];
    cell.textLabel.text =[NSString stringWithFormat:@"%@ %@", [[_horarios objectAtIndex:indexPath.row] valueForKey:@"descripcion"],[[_horarios objectAtIndex:indexPath.row] valueForKey:@"horario"]];

    return cell;
}



// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    // Return NO if you do not want the specified item to be editable.
    return YES;
}


-(void)deleteFromApi:(int)row {

    
    NSIndexPath *path = [NSIndexPath indexPathForRow:row inSection:0];
    
    UITableViewCell *cell = [self.tableView cellForRowAtIndexPath:path];
    NSString *horario = cell.textLabel.text;
    
    
    
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    load = [LoadingView loadingViewInView:self.view];
    if (app.hasInternet)
    {
        dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
            NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
            NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
            NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
            NSString *correo = [defaults objectForKey:@"correoActual"];
            
            NSString *post = [NSString stringWithFormat:@"servicio=app&accion=deleteHorario&correo=%@&horario=%@",correo,horario];
            NSData *postData = [post dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
            
            NSString *postLength = [NSString stringWithFormat:@"%d", (int)[postData length]];
            
            
            NSCharacterSet *set = [NSCharacterSet URLQueryAllowedCharacterSet];
            
            NSString* encodedUrl = [urlString stringByAddingPercentEncodingWithAllowedCharacters:
                                    set];
            NSURL * url = [NSURL URLWithString:encodedUrl];
            NSMutableURLRequest * urlRequest = [NSMutableURLRequest requestWithURL:url];
            [urlRequest setHTTPMethod:@"POST"];//GET
            [urlRequest setValue:postLength forHTTPHeaderField:@"Content-Length"];
            [urlRequest setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
            
            [urlRequest setHTTPBody:postData];
            NSURLSessionDataTask * dataTask =[defaultSession dataTaskWithRequest:urlRequest                                                               completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
             //   NSLog(@"%@",[error description]);
                if(error == nil)
                {
                    NSError* error;
                    NSDictionary* json = [NSJSONSerialization
                                          JSONObjectWithData:data
                                          options:kNilOptions
                                          error:&error];
                    int success = [[json objectForKey:@"success"] intValue];
                    
                    if(success==1)
                    {
                        _horarios = [json objectForKey:@"horarios"];
                        [self.tableView reloadData];
                    }
                    else
                    {
                    }
                }
                [load removeView];
            }];
            
            [dataTask resume];
            
            dispatch_async(dispatch_get_main_queue(), ^{
                // Code to update the UI/send notifications based on the results of the background processing
                //            [_message show];
                
                
            });
        });
        
    }
    else
    {
        [self showNoHayInternet];
    }

}
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath {
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        
      //  [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
        [self deleteFromApi:(int)indexPath.row];
        
    } else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}


/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath {
}
*/

/*
// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath {
    // Return NO if you do not want the item to be re-orderable.
    return YES;
}
*/

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
