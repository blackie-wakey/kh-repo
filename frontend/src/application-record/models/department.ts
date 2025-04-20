import { Model, Attr } from 'spraypaint';
import { ApplicationRecord } from './base';
@Model()
export class Department extends ApplicationRecord {
    static jsonapiType = "departments"

    @Attr() name!: string
}
