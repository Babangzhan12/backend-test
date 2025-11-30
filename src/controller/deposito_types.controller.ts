import { BaseController } from '../base/base.controller';
import { DepositoType } from '../model/index.model';

export class DepositoTypesController extends BaseController<DepositoType> {
  constructor() {
    super(DepositoType, {
      searchableFields: [''],
    });
  }

}
