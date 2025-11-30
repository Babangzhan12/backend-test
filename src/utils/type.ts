import { Request } from 'express'

export interface IUserJwt {
    userId:string;
    role?: string
}

export interface IAuthRequest extends Request {
  user?: IUserJwt
}


export interface FeatureRow {
  parent_name: string;
  parent_icon: string;
  key: string;
  name: string;
  icon: string;
  parentId: number | null;
}
export type ParentGroup = {
  type: 'parent';
  name: string;
  icon: string;
  features: {
    key: string;
    name: string;
    parent: string;
    icon: string;
    action?: string[]
  }[];
};

export type FlatFeature = {
  type: 'feature';
  key: string;
  name: string;
  icon: string;
  action?: string[]
};

export type GroupedFeature = ParentGroup | FlatFeature;