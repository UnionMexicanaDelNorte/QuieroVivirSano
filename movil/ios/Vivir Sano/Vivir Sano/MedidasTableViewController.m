//
//  MedidasTableViewController.m
//  Vivir Sano
//
//  Created by Fernando Alonso on 29/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//

#import "MedidasTableViewController.h"
#import "MedidasTableViewCell.h"
#import "AppDelegate.h"
#import "Checate.h"
@interface MedidasTableViewController ()

@end

@implementation MedidasTableViewController
-(void)closeTable
{
    [self dismissViewControllerAnimated:YES completion:nil];
}
-(void)save
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *correo = [defaults objectForKey:@"correoActual"];
    if([correo isEqualToString:@""])//no login
    {
        UIAlertController * view=   [UIAlertController
                                     alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                     message:NSLocalizedString(@"primeroCorreo", nil)
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
        return;
    }
    NSIndexPath *path = [NSIndexPath indexPathForRow:0 inSection:0];
    
    MedidasTableViewCell *cell = [self.tableView cellForRowAtIndexPath:path];
    NSString *peso = cell.cantidadText.text;
    
    
    NSIndexPath *path1 = [NSIndexPath indexPathForRow:1 inSection:0];
    MedidasTableViewCell *cell1 = [self.tableView cellForRowAtIndexPath:path1];
    
    NSString *cm = cell1.cantidadText.text;
    int pesoNumeroICM =[peso intValue];
    int cmNumeroICM = [cm intValue];
    
    if([peso isEqualToString:@""] || [cm isEqualToString:@""] || pesoNumeroICM == 0 || cmNumeroICM == 0)//no login
    {
        UIAlertController * view=   [UIAlertController
                                     alertControllerWithTitle:NSLocalizedString(@"titulo", nil)
                                     message:NSLocalizedString(@"teFalta", nil)
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
        return;
    }
    
    
    
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    NSEntityDescription *entity = [[self.fetchedResultsController fetchRequest] entity];
    NSManagedObject *newManagedObject = [NSEntityDescription insertNewObjectForEntityForName:[entity name] inManagedObjectContext:[app managedObjectContext]];
    NSInteger time = [[NSDate date] timeIntervalSince1970];
    NSNumber *marbleNumber = [NSNumber numberWithInt:(int)time];
    [newManagedObject setValue:marbleNumber forKey:@"timestamp"];
    
    NSNumber *pesoNumero = [NSNumber numberWithInt:[peso intValue]];
    NSNumber *cmNumero = [NSNumber numberWithInt:[cm intValue]];
    NSNumber *sincronizadoNumero = [NSNumber numberWithInt:0];
    
    [newManagedObject setValue:pesoNumero forKey:@"peso"];
    [newManagedObject setValue:cmNumero forKey:@"cm"];
    
    [newManagedObject setValue:sincronizadoNumero forKey:@"sincronizado"];
    
    [newManagedObject setValue:correo forKey:@"correo"];
    NSError *error = nil;
    if (![app.managedObjectContext save:&error]) {
        NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
        abort();
    }
    //goto diagnostico
    [[NSUserDefaults standardUserDefaults] setInteger:pesoNumeroICM forKey:@"pesoActual"];
    [[NSUserDefaults standardUserDefaults] setInteger:cmNumeroICM forKey:@"cmActual"];
    
    [[NSUserDefaults standardUserDefaults] synchronize];
    //try sincronize
    if(app.hasInternet)
    {
        //get all imc when sincronizado = 0
        NSFetchRequest *fetchRequest2 = [[NSFetchRequest alloc] init];
        NSEntityDescription *entity2 = [NSEntityDescription entityForName:@"Checate" inManagedObjectContext:[app managedObjectContext]];
        [fetchRequest2 setEntity:entity2];
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSString *correo = [defaults objectForKey:@"correoActual"];
        //
        NSPredicate *predicate = [NSPredicate predicateWithFormat:@"correo=%@ AND sincronizado=0",correo ];
        [fetchRequest2 setPredicate:predicate];
        [fetchRequest2 setFetchBatchSize:20];
        NSSortDescriptor *sortDescriptor2 = [[NSSortDescriptor alloc] initWithKey:@"timestamp" ascending:NO];
        [fetchRequest2 setSortDescriptors:@[sortDescriptor2]];
        NSFetchedResultsController *aFetchedResultsController2 = [[NSFetchedResultsController alloc] initWithFetchRequest:fetchRequest2 managedObjectContext:[app managedObjectContext] sectionNameKeyPath:nil cacheName:nil];
        aFetchedResultsController2.delegate = self;
        NSError *error = nil;
        self.fetchedResultsController = aFetchedResultsController2;
        
        if (![self.fetchedResultsController performFetch:&error]) {
            NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
            abort();
        }
         int i;
        load = [LoadingView loadingViewInView:self.view];
        
        for(i=0;i<self.fetchedResultsController.fetchedObjects.count;i++)
        {
            NSManagedObject *man = [self.fetchedResultsController.fetchedObjects objectAtIndex:i];
            dispatch_async( dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                NSURLSessionConfiguration *defaultConfigObject = [NSURLSessionConfiguration defaultSessionConfiguration];
                NSURLSession *defaultSession = [NSURLSession sessionWithConfiguration: defaultConfigObject delegate: nil delegateQueue: [NSOperationQueue mainQueue]];
                NSString *urlString = [NSString stringWithFormat:@"http://quierovivirsano.org/app/qvs.php"];
                NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
                NSString *correo = [defaults objectForKey:@"correoActual"];
                
                
                NSString *post = [NSString stringWithFormat:@"servicio=app&accion=saveIMC&correo=%@&cm=%@&kg=%@",correo,cmNumero,pesoNumero];
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
                    //  NSLog(@"%@",[error description]);
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
                            NSNumber *numero = [NSNumber numberWithInteger:1];
                            [man setValue:numero forKey:@"sincronizado"];
                            NSError *errorX = nil;
                            if (![app.managedObjectContext save:&errorX]) {
                                NSLog(@"Unresolved error %@, %@", errorX, [errorX userInfo]);
                                abort();
                            }
                            //el ultimo
                            if(i==self.fetchedResultsController.fetchedObjects.count-1)
                            {
                                dispatch_async(dispatch_get_main_queue(), ^{
                                    [load removeView];
                                     [self dismissViewControllerAnimated:YES completion:nil];
                                    
                                });
                                
                            }
                        }
                        else
                        {
                        }
                    }
                   
                }];
                
                [dataTask resume];
                
               
            });
        }
    }
    else
    {
        [self dismissViewControllerAnimated:YES completion:nil];
    }
}
- (void)viewDidLoad {
    [super viewDidLoad];
    self.title=NSLocalizedString(@"medidas", @"");
    
    
    UIBarButtonItem *cancel = [[UIBarButtonItem alloc] initWithTitle:NSLocalizedString(@"cancelar", @"") style:UIBarButtonItemStylePlain target:self action:@selector(closeTable)];
    self.navigationItem.leftBarButtonItem=cancel;
    
    UIBarButtonItem *save = [[UIBarButtonItem alloc] initWithTitle:NSLocalizedString(@"guardar", @"") style:UIBarButtonItemStylePlain target:self action:@selector(save)];
    self.navigationItem.rightBarButtonItem=save;
    
    [self.tableView registerClass:[MedidasTableViewCell class] forCellReuseIdentifier:@"MedidasTableViewCell"];
    UINib *nib = [UINib nibWithNibName:@"MedidasTableViewCell" bundle:[NSBundle mainBundle]];
    [self.tableView registerNib:nib forCellReuseIdentifier:@"MedidasTableViewCell"];
    // Uncomment the following line to preserve selection between presentations.
    // self.clearsSelectionOnViewWillAppear = NO;
    
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;
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

    return 2;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath;
{
    return 71;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    MedidasTableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"MedidasTableViewCell" forIndexPath:indexPath];
    // Configure the cell...
    if(indexPath.row==0)
    {
        cell.medidasAbreviatura.text=@"kg";
        cell.medidadPalabra.text=NSLocalizedString(@"peso", @"");
        [cell.cantidadText becomeFirstResponder];
    }
    if(indexPath.row==1)
    {
        cell.medidasAbreviatura.text=@"cm";
        cell.medidadPalabra.text=NSLocalizedString(@"altura", @"");
    }
    
    return cell;
}


/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath {
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/

/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath {
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    } else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/

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
#pragma mark - Fetched results controller

- (NSFetchedResultsController *)fetchedResultsController
{
    if (_fetchedResultsController != nil) {
        return _fetchedResultsController;
    }
    AppDelegate *app = (AppDelegate*)[[UIApplication sharedApplication] delegate];
    
    NSFetchRequest *fetchRequest = [[NSFetchRequest alloc] init];
    NSEntityDescription *entity = [NSEntityDescription entityForName:@"Checate" inManagedObjectContext:[app managedObjectContext]];
    [fetchRequest setEntity:entity];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *correo = [defaults objectForKey:@"correoActual"];
    NSPredicate *predicate = [NSPredicate predicateWithFormat:@"correo=%@",correo ];
    [fetchRequest setPredicate:predicate];
    [fetchRequest setFetchBatchSize:20];
    NSSortDescriptor *sortDescriptor = [[NSSortDescriptor alloc] initWithKey:@"timestamp" ascending:NO];
    [fetchRequest setSortDescriptors:@[sortDescriptor]];
    NSFetchedResultsController *aFetchedResultsController = [[NSFetchedResultsController alloc] initWithFetchRequest:fetchRequest managedObjectContext:[app managedObjectContext] sectionNameKeyPath:nil cacheName:nil];
    aFetchedResultsController.delegate = self;
    self.fetchedResultsController = aFetchedResultsController;
    
    NSError *error = nil;
    if (![self.fetchedResultsController performFetch:&error]) {
        NSLog(@"Unresolved error %@, %@", error, [error userInfo]);
        abort();
    }
    return _fetchedResultsController;
}
@end
