import { NextFunction,Response } from 'express';
import { BaseController, RequestWithUser } from '../base/base.controller';
import { Profile, User } from '../model/index.model';
import { jsonBadRequest, jsonSuccess } from '../utils/responses';

export class ProfileController extends BaseController<Profile> {
  constructor() {
    super(Profile, {
      searchableFields: [''],
    });
  }

}
