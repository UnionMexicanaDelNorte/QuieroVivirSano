//
//  RightMenuViewController.m
//  SlideMenu
//
//  Created by Aryan Gh on 4/26/14.
//  Copyright (c) 2014 Aryan Ghassemi. All rights reserved.
//

#import "RightMenuViewController.h"
#import "CMPopTipView.h"
@implementation RightMenuViewController

#pragma mark - UIViewController Methods -

-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self.tableView reloadData];//for support esPromotor
}
- (void)viewDidLoad
{
	[super viewDidLoad];
	
	self.tableView.separatorColor = [UIColor lightGrayColor];
	
	UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"rightMenu.jpg"]];
	self.tableView.backgroundView = imageView;
}

#pragma mark - UITableView Delegate & Datasrouce -

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    int esPromotor = [[defaults valueForKey:@"esPromotor"] intValue];
    if(esPromotor==1)//si es promotor
    {
        return 6;
    }
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

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
	UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"rightMenuCell"];
    cell.textLabel.textAlignment = NSTextAlignmentRight;
    cell.textLabel.textColor = [UIColor whiteColor];
	switch (indexPath.row)
	{
		case 0:
        {
            cell.textLabel.text = NSLocalizedString(@"entrar", @"");
            NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
            NSString *correo = [defaults objectForKey:@"correoActual"];
            if([correo isEqualToString:@""])//no login
            {
                CMPopTipView *popTipView;
                popTipView = [[CMPopTipView alloc] initWithTitle:NSLocalizedString(@"tutorialSesion", @"") message:@""];
                popTipView.animation = arc4random() % 2;
                popTipView.has3DStyle = NO;
                popTipView.dismissTapAnywhere = YES;
                [popTipView presentPointingAtView:cell inView:self.tableView animated:YES];
                
            }
        }
        break;
		case 1:
			cell.textLabel.text = NSLocalizedString(@"cerrar", @"");
        break;
		case 2:
			cell.textLabel.text = NSLocalizedString(@"notificaciones", @"");
        break;
        case 3:
            cell.textLabel.text = NSLocalizedString(@"elegirLugar", @"");
        break;
        case 4:
            cell.textLabel.text = NSLocalizedString(@"elegirHorarios", @"");
        break;
        case 5:
            cell.textLabel.text = NSLocalizedString(@"verParticipantes", @"");
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
            [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"deboLoginFacebook"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            revealAnimator = [[SlideNavigationContorllerAnimatorSlide alloc] init];
            animationDuration = .19;
			break;
			
		case 1:
            [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"deboLogoutFacebook"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            
            
			revealAnimator = [[SlideNavigationContorllerAnimatorSlide alloc] init];
			animationDuration = .19;
			break;
			
		case 2:
            [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"deboSacarAlarma"];
            [[NSUserDefaults standardUserDefaults] synchronize];
            
			revealAnimator = [[SlideNavigationContorllerAnimatorFade alloc] init];
			animationDuration = .18;
			break;
			
		case 3:
            [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"deboPresentarElegirGPS"];
            [[NSUserDefaults standardUserDefaults] synchronize];
			revealAnimator = [[SlideNavigationContorllerAnimatorSlideAndFade alloc] initWithMaximumFadeAlpha:.8 fadeColor:[UIColor blackColor] andSlideMovement:100];
			animationDuration = .19;
			break;
			
		case 4:
            [[NSUserDefaults standardUserDefaults] setInteger:1 forKey:@"deboPresentarElegirHorario"];
            [[NSUserDefaults standardUserDefaults] synchronize];
			revealAnimator = [[SlideNavigationContorllerAnimatorScale alloc] init];
			animationDuration = .22;
			break;
			
		case 5:
			revealAnimator = [[SlideNavigationContorllerAnimatorScaleAndFade alloc] initWithMaximumFadeAlpha:.6 fadeColor:[UIColor blackColor] andMinimumScale:.8];
			animationDuration = .22;
			break;
			
		default:
			return;
	}
	
	[[SlideNavigationController sharedInstance] closeMenuWithCompletion:^{
		[SlideNavigationController sharedInstance].menuRevealAnimationDuration = animationDuration;
		[SlideNavigationController sharedInstance].menuRevealAnimator = revealAnimator;
	}];
}

@end
