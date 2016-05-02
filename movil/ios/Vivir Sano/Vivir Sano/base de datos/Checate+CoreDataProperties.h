//
//  Checate+CoreDataProperties.h
//  Vivir Sano
//
//  Created by Fernando Alonso on 29/03/16.
//  Copyright © 2016 UMN. All rights reserved.
//
//  Choose "Create NSManagedObject Subclass…" from the Core Data editor menu
//  to delete and recreate this implementation file for your updated model.
//

#import "Checate.h"

NS_ASSUME_NONNULL_BEGIN

@interface Checate (CoreDataProperties)

@property (nullable, nonatomic, retain) NSNumber *timestamp;
@property (nullable, nonatomic, retain) NSNumber *peso;
@property (nullable, nonatomic, retain) NSNumber *cm;
@property (nullable, nonatomic, retain) NSString *correo;
@property (nullable, nonatomic, retain) NSNumber *sincronizado;

@end

NS_ASSUME_NONNULL_END
