import { Attr, BelongsTo, Model } from 'spraypaint';
import { ApplicationRecord } from './base';
import { Department } from './department';

@Model()
export class Employee extends ApplicationRecord {
    static jsonapiType = 'employees';

    @Attr() firstName!: string
    @Attr() lastName!: string
    @Attr() age!: number
    @Attr() position!: string

    @BelongsTo() department!: Department;
}

