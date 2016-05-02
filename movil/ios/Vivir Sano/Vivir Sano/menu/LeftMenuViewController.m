//
//  MenuViewController.m
//  SlideMenu
//
//  Created by Aryan Gh on 4/24/13.
//  Copyright (c) 2013 Aryan Ghassemi. All rights reserved.
//

#import "LeftMenuViewController.h"
#import "AppDelegate.h"
#import "CMPopTipView.h"
#import "SlideNavigationContorllerAnimatorFade.h"
#import "SlideNavigationContorllerAnimatorSlide.h"
#import "SlideNavigationContorllerAnimatorScale.h"
#import "SlideNavigationContorllerAnimatorScaleAndFade.h"
#import "SlideNavigationContorllerAnimatorSlideAndFade.h"

@implementation LeftMenuViewController

#pragma mark - UIViewController Methods -

- (id)initWithCoder:(NSCoder *)aDecoder
{
	self.slideOutAnimationEnabled = YES;
	return [super initWithCoder:aDecoder];
}
-(void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self ponImagenDePerfilYNombre];
}
- (void)viewDidLoad
{
	[super viewDidLoad];
	
  //  imageView.layer.cornerRadius = image.size.width / 2;
    //imageView.layer.masksToBounds = YES;
    
    _imagenDePerfil.layer.cornerRadius = _imagenDePerfil.frame.size.width/2;
    _imagenDePerfil.layer.masksToBounds = YES;
    
	/*self.tableView.separatorColor = [UIColor lightGrayColor];
	
	UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"leftMenu.jpg"]];
	self.tableView.backgroundView = imageView;*/
}

#pragma mark - UITableView Delegate & Datasrouce -

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
	return 3;
}

- (UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
	UIView *view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.tableView.frame.size.width, 20)];
	view.backgroundColor = [UIColor clearColor];
	return view;
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
	return 20;
}
-(void)ponImagenDePerfilYNombre {
    
    NSString *base64 = [[NSUserDefaults standardUserDefaults] objectForKey:@"perfil"];
    NSData *decodedData = [[NSData alloc] initWithBase64EncodedString:base64 options:0];
    UIImage *perfil = [UIImage imageWithData:decodedData];
    
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *correo = [defaults objectForKey:@"correoActual"];
    if(![correo isEqualToString:@""])
    {
        NSString *name = [defaults objectForKey:@"name"];
        _panchaLabel.text=[NSString stringWithFormat:@"%@",name];
    }
    else
    {
        _panchaLabel.text=@"";//NSLocalizedString(@"primeroCorreo", @"");
    }
    _imagenDePerfil.image=perfil;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath;
{
    return 60;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
	UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"leftMenuCell"];
    cell.textLabel.textAlignment = NSTextAlignmentLeft;
    cell.textLabel.textColor = [UIColor whiteColor];
	switch (indexPath.row)
	{
		case 0:
        {
            cell.textLabel.text = NSLocalizedString(@"registrar", @"");
            NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
            NSString *correo = [defaults objectForKey:@"correoActual"];
            cell.imageView.image = [UIImage imageNamed:@"soporte.png"];
            if([correo isEqualToString:@""])//no login
            {
            }
            else
            {
                if([self checkIfExistRows]==0)//no tiene registros con el correo actual
                {
                    CMPopTipView *popTipView;
                    popTipView = [[CMPopTipView alloc] initWithTitle:NSLocalizedString(@"tutorialMedidas", @"") message:@""];
                    popTipView.animation = arc4random() % 2;
                    popTipView.has3DStyle = NO;
                    popTipView.dismissTapAnywhere = YES;
                    [popTipView presentPointingAtView:cell inView:self.tableView animated:YES];
                }
            }
        }
        break;
		case 1:
            cell.imageView.image = [UIImage imageNamed:@"comunidad.png"];
            cell.textLabel.text = NSLocalizedString(@"unirse", @"");
        break;
        case 2:
            cell.imageView.image = [UIImage imageNamed:@"quees.png"];
            cell.textLabel.text = NSLocalizedString(@"queEs", @"");
        break;
	}
	
	cell.backgroundColor = [UIColor clearColor];
	
	return cell;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    id <SlideNavigationContorllerAnimator> revealAnimator;
    CGFloat animationDuration = 0;
    
	
	switch (indexPath.row)
	{
		case 0:
        {
            [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"deboPresentarMedidas"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            revealAnimator = [[SlideNavigationContorllerAnimatorSlide alloc] init];
            animationDuration = .19;
            
        }
        break;
        case 1:
        {
            [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"deboPresentarMapa"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            revealAnimator = [[SlideNavigationContorllerAnimatorSlide alloc] init];
            animationDuration = .19;
            
        }
			break;
		case 2:
        {
            [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"deboPresentarQueEs"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            revealAnimator = [[SlideNavigationContorllerAnimatorSlide alloc] init];
            animationDuration = .19;
            
        }
        break;
			
		
	}
	
    [[SlideNavigationController sharedInstance] closeMenuWithCompletion:^{
        [SlideNavigationController sharedInstance].menuRevealAnimationDuration = animationDuration;
        [SlideNavigationController sharedInstance].menuRevealAnimator = revealAnimator;
    }];
}
#pragma mark - Fetched results controller
-(long)checkIfExistRows{
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
    return self.fetchedResultsController.fetchedObjects.count;
}
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
