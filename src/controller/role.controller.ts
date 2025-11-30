import { FindOptions } from 'sequelize';
import { BaseController } from '../base/base.controller';
import { Role } from '../model/index.model';

export class RoleController extends BaseController<Role> {
  constructor() {
    super(Role, {
      searchableFields: [''],
    });
  }

  protected override getBySelectOptions(): FindOptions {
                                                      
      return {
        attributes: ['roleId','name']
      }
    }
}
