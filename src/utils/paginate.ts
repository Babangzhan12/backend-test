import { FindAndCountOptions, Model, ModelStatic, Op } from "sequelize";
import { each } from "lodash";

interface FlexibleQuery {
  filter?: {
    order?: string;
    skip?: string;
    include?: any;
    where?: Record<string, any>;
    page?: string;
    size?: string;
    search?: string;
    perPage?: string;
  }; 
}

export async function flexiblePaginate<T extends Model>(
  model: ModelStatic<T>,
  query?: FlexibleQuery,
  searchableFields: string[] = [],
  defaultOptions?: FindAndCountOptions
) {
  const option: FindAndCountOptions = {
    limit: 10,
    ...defaultOptions,
  };
  console.log("Paginate options:", defaultOptions);
  const filter = query?.filter ?? {};

  if (filter.order) {
    const split = filter.order.split(" ");
    option.order = [[split[0], (split[1] || "asc") as any]];
  }

  if (filter.skip) option.offset = parseInt(filter.skip);
  if (filter.size) option.limit = parseInt(filter.size);
  if (filter.perPage) option.limit = parseInt(filter.perPage);
  if (filter.page) {
    option.offset = (parseInt((filter.page || "1")) - 1) * (option.limit || 10);
  }

  if (filter.include) {
    option.include = Array.isArray(filter.include) ? filter.include : [filter.include];
    option.distinct = true;
  }
  if (defaultOptions?.include) {
    option.include = Array.isArray(defaultOptions?.include) ? defaultOptions?.include : [defaultOptions?.include];
    option.distinct = true;
  }

const where: Record<string | symbol, any> = {};

if (filter.search && searchableFields.length > 0) {
  console.log(`Searching for: ${filter.search}`);

  where[Op.or] = searchableFields.map((field) => ({
    [field]: { [Op.like]: `%${filter.search}%` }, 
  }));
}

const excludeKeys = ['order', 'skip', 'size', 'perPage', 'page', 'include', 'search', 'where'];
  for (const key in filter) {
  const value = (filter as Record<string, any>)[key];
  if (!excludeKeys.includes(key) && value !== undefined && value !== '') {
    where[key] = { [Op.eq]: value };
  }
}

  // Tambahan kondisi where dari query
  if (filter.where) {
    each(filter.where, (val: any, key: any) => {
      if (typeof val === "object" && val !== null) {
        const opKey = Object.keys(val)[0];
        const opValue = val[opKey];
  
        let sequelizeOp: symbol;
        switch (opKey) {
          case 'iLike':
          case 'like':
            sequelizeOp = Op.like;
            break;
          case 'substring':
            sequelizeOp = Op.substring;
            break;
          case 'eq':
            sequelizeOp = Op.eq;
            break;
          default:
            sequelizeOp = (Op as any)[opKey];
            break;
        }
  
        where[key] = { [sequelizeOp]: opKey.includes('like') ? `%${opValue}%` : opValue };
      } else {
        where[key] = { [Op.eq]: val };
      }
    });
  }
  // if (filter.where) {
  //   each(filter.where, (val:any, key:any) => {
  //     if (typeof val === "object" && val !== null) {
  //       const opKey = Object.keys(val)[0] as keyof typeof Op;
  //       const opValue = val[opKey];
  //       const sequelizeOp = opKey === "like" ? Op.substring : Op[opKey];
  //       where[key] = { [sequelizeOp]: opValue };
  //     } else {
  //       where[key] = { [Op.eq]: val };
  //     }
  //   });
  // }

  option.where = where;

  const result = await model.findAndCountAll(option);
  const totalPages = option.limit ? Math.ceil(result.count / option.limit) : 1;
  const currentPage = filter.page ? parseInt(filter.page) : 1;
  return {
    data: result.rows,
    total: result.count,
    totalPages,
    currentPage,
    perPage : filter.perPage ? parseInt(filter.perPage)  : 10
  };
}
