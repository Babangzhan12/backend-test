import { BaseController, RequestWithUser } from "../base/base.controller";
import { Account, Profile, Role, User } from "../model/index.model";
import bcrypt from 'bcrypt';

export class UserController extends BaseController<User> {
  constructor() {
    super(User, {
      searchableFields: [''],
    });
  }

   protected async beforeCreate(data: any, req: RequestWithUser): Promise<any> {
    return {
      ...data,
      ...(data.password ? { password: await bcrypt.hash(data.password, 10) } : {}),
    };
  }

  protected async beforeUpdate(data: any, req: RequestWithUser): Promise<any> {
  return {
    ...data,
    ...(data.password ? { password: await bcrypt.hash(data.password, 10) } : {}),
  };
}
}