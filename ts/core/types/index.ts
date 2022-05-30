import { NextFunction, Request, Response } from "express";
import LakafRouting from "../classes/LakafRouting";
import { Socket } from "socket.io";

type IndexSignature = string | number;

export type Json = {
  [member: string]:
    | string
    | number
    | boolean
    | undefined
    | Date
    | object
    | Function
    | symbol
    | any
    | Json;
};

export type GenericJSON<T> = Record<string, T>;

export type Config = {
  authorizationTokenPrefix?: string;
  /**
   * @key useRealtime: @type boolean
   *
   * Specify if application is realtime
   */
  useRealtime?: boolean;
  /**
   * @key corsConfig: @type Json
   *
   * Specify cors configuration about application
   */
  corsConfig?: Json;
  /**
   * @key storagePath: @type string
   *
   * Specify absolute path of folder to use as storage
   */
  storagePath?: string;
  /**
   * @key storeFolders: @type Json
   *
   * Contains an objet which have all folder names to use in the storage application
   */
  storeFolders?: Json;
  /**
   * @key viewConfig: @type Json
   *
   * Contains two keys such as engine and folder.
   * ** @key engine
   * ** specify which engine template will used in tha application.
   * ** @key folder
   * ** specify which folder will contain all templates files.
   */
  viewConfig?: {
    engine: string;
    folder: string;
  };
};

export type DbConfig = {
  /**
   * @key type: "mysql" | "postgresql" | "sqlite" | "mongodb" | "oracle" | "maria" | "casandra" | "other"
   *
   * Only "mysql" is supported actually
   *
   * Specify database type.
   */
  type:
    | "mysql"
    | "postgresql"
    | "sqlite"
    | "mongodb"
    | "oracle"
    | "maria"
    | "casandra"
    | "other";
  /**
   * @key host: @type string
   *
   * Specify name of host which contains database.
   */
  host: string;
  /**
   * @key user: @type string
   *
   * Specify user who connect to the database.
   */
  user: string;
  /**
   * @key password: @type string
   *
   * Specify password of user who connect to the database.
   */
  password: string;
  /**
   * @key database: @type string
   *
   * Specify database name.
   */
  database: string;
  /**
   * @key storeFolders: @type boolean
   *
   * Specify multiple statements status.
   */
  multipleStatements?: boolean;
};

export type MailConfig = {
  emailSender: string;
  emailPassword: string;
  emailService: string;
  emailHost: string;
  emailPort: number;
};

export type LogConfig = {
  logsFolder: string;
  showInConsole: boolean;
  extension: string;
};

export type StorageConfig = {
  image?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  document?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  video?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  audio?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  archive?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  other?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  css?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  captcha_image?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  i18n?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  javascript?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  text?: { folder: string; middleware?: LakafMiddlewareAction[]; };
  voice?: { folder: string; middleware?: LakafMiddlewareAction[]; };
};

export type UploadConfig = {
  limits: {
    archive?: number | "infinite";
    audio?: number | "infinite";
    captcha_image?: number | "infinite";
    css?: number | "infinite";
    document?: number | "infinite";
    i18n?: number | "infinite";
    image?: number | "infinite";
    javascript?: number | "infinite";
    other?: number | "infinite";
    text?: number | "infinite";
    video?: number | "infinite";
    voice?: number | "infinite";
  };
};

export type AllowedFileTypes = "audio" | "document" | "image" | "video";

export type LakafRouterGroupELement = {
  verb: "GET" | "POST" | "PUT" | "DELETE";
  brick: string;
  middlewares: LakafMiddlewareAction[];
  controller: LakafControllerAction;
};

export type LakafRouterGroupCallback = {
  (routerChild: LakafRouting): void;
};

export type LakafMiddlewareRouting = {
  _get: {
    (
      brick: string,
      middlewares: LakafMiddlewareAction[],
      controller: LakafControllerAction
    ): LakafMiddlewareRouting;
  };
  _post: {
    (
      brick: string,
      middlewares: LakafMiddlewareAction[],
      controller: LakafControllerAction
    ): LakafMiddlewareRouting;
  };
  _put: {
    (
      brick: string,
      middlewares: LakafMiddlewareAction[],
      controller: LakafControllerAction
    ): LakafMiddlewareRouting;
  };
  _delete: {
    (
      brick: string,
      middlewares: LakafMiddlewareAction[],
      controller: LakafControllerAction
    ): LakafMiddlewareRouting;
  };
  _resource: {
    (
      brick: string,
      middlewares: LakafMiddlewareAction[],
      controller: LakafResourceControllerInterface,
      specificResources?: LakafResourceArray
    ): LakafMiddlewareRouting;
  };
};

export type LakafRouterMiddlewareCallback = {
  (routerChild: LakafMiddlewareRouting): void;
};

export type LakafControllerAction = {
  (req: Request, res: Response): void;
};

export type LakafMiddlewareAction = {
  (req: Request, res: Response, next: NextFunction): void;
};

export type LakafServiceAction = {
  (req: Request, res: Response): any;
};

export type LakafCriteriaFunction = {
  (req?: Request, res?: Response): boolean | Promise<boolean>;
};

export interface LakafResourceControllerInterface {
  /**
   * Documentation of index method
   *
   * @verb "GET"
   *
   * This method is used to get data using GET verb
   */
  index: LakafControllerAction;
  /**
   * Documentation of create method
   *
   * @verb "GET"
   *
   * This method is used to get form that will be used from the client to send data.
   * It's used with GET verb
   */
  create: LakafControllerAction;
  /**
   * Documentation of store method
   *
   * @verb "POST"
   *
   * This method is used to save data by POST verb
   */
  store: LakafControllerAction;
  /**
   * Documentation of show method
   *
   * This method is used to get specific data using GET verb
   */
  show: LakafControllerAction;
  /**
   * Documentation of edit method
   *
   * @verb "GET"
   *
   * This method is used to get form that will be used from the client to send specific data.
   * It's used with GET verb
   */
  edit: LakafControllerAction;
  /**
   * Documentation of update method
   *
   * @verb "PUT"
   *
   * This method is used to update specific data using PUT verb
   */
  update: LakafControllerAction;
  /**
   * Documentation of update method
   *
   * @verb "DELETE"
   *
   * This method is used to delete specific data using DELETE verb
   */
  destroy: LakafControllerAction;
}

export type EnvTemplate = {
  /**
   *@key PORT : @type number
   * Specify a port where the application will started.
   */
  PORT?: number;
  /**
   *@key HOST : @type string
   * Specify a host name where the application will started, usually, localhost has used.
   */
  HOST?: string;
  /**
   *@key maintenance : "enabled" | "disabled"
   * Specify if application is in maintenance mode, ie every request will resolve with response text associated to this mode.
   */
  maintenance?: "enabled" | "disabled";
  /**
   *@key mode : "development" | "production"
   * Specify if application is in development or production mode.
   */
  mode?: "development" | "production";
  /**
   *@key config : @type Config
   * Contains all configuration about application. Let's see config documentation.
   */
  config?: Config;
  /**
   *@key dbConfig : @type DbConfig
   * Contains all configuration about database. Let's see dbConfig documentation.
   */
  dbConfig?: DbConfig;
  /**
   *@key mailConfig : @type MailConfig
   * Contains all configuration about sending mail.
   */
  mailConfig?: MailConfig;
  /**
   *@key clientUrl : @type string
   * Contains client url.
   */
  clientUrl?: string;
  /**
   *@key jwtKey : @type string
   * Contains jwt key.
   */
  jwtKey: string;
  /**
   *@key logConfig : @type LogConfig
   * Contains all configuration about logConfig.
   */
  logConfig?: LogConfig;
  /**
   *@key storageConfig : @type StorageConfig
   * Contains all configuration about storage management in the application. Let see the storage configuration documentation.
   */
  storageConfig?: StorageConfig;
  /**
   *@key uploadConfig : @type UploadConfig
   * Contains all configuration about upload limit size management in the application. Let see the upload configuration documentation.
   */
  uploadConfig: UploadConfig;
};

/**
 * @action "resource"
 *
 * This data is used to specify the type of action associated with the resource.
 *
 * - "create" corresponds to "GET" from route {brick}/create
 *
 * - "destroy" corresponds to "DELETE" from route {brick}/
 *
 * - "edit" corresponds to "GET" from route {brick}/:id/edit
 *
 * - "index" corresponds to "GET" from route {brick}/
 *
 * - "show" corresponds to "GET" from route {brick}/:id
 *
 * - "store" corresponds to "POST" from route {brick}/
 *
 * - "update" corresponds to "PUT" from route {brick}/:id
 *
 */
export type LakafResource =
  | "create"
  | "destroy"
  | "edit"
  | "index"
  | "show"
  | "store"
  | "update";

export type LakafResourceArray = LakafResource[];

type LakafSqlComparator = "<" | ">" | "=" | "<>" | "<=" | ">=";

type LakafLogicSqlOperator = "OR" | "AND" | "NOT" | "NOT";

type LakafComparableData = string | number;

export type LakafSqlComparison = [
  /** Left value of sql comparison */
  LakafComparableData,
  /** Middle value of sql comparison */
  LakafSqlComparator,
  /** Right value of sql comparison */
  LakafComparableData
];

export type LakafSqlCriteria = [
  /** Left value of sql criteria */
  boolean | LakafSqlCriteria | LakafSqlComparison,
  /** Middle value of sql criteria */
  LakafLogicSqlOperator,
  /** Right value of sql criteria */
  boolean | LakafSqlCriteria | LakafSqlComparison
];

export interface LakafRequestValidatorInterface {
  template: Json;
  onFail?: { message: Json };
  validate: { (): void };
}

export type FieldTemplate = {
  name: string;
  valueType: "integer" | "varchar" | "text" | "numeric" | "boolean";
  length?: number | null;
  nullable?: boolean;
  fillable?: boolean;
  defaultValue?: any | "computed";
};

export type ValidationReport = {
  success: boolean;
  message?: string;
};

export type CriteriaOption = {
  WHERE?: string;
  DESC?: Boolean;
  ORDER_BY?: "string";
  LIMIT?: number | string;
};

export type UserTemplateType = {
  username: string;
  role: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: number | null;
  password: string;
  country: number | null;
  town: number | null;
  avatar: number;
  cover: number;
  birthday: string | null;
  activated: boolean;
  lang: number;
  created_at: string;
  updated_at: string | null;
};

export type AliasTemplateType = {
  alias_name: string;
  password: string;
  creator: number;
  owner: number;
  shop_owner: number;
  role: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type ShopTemplateType = {
  owner: number;
  shop_name: string;
  shop_pseudo: string;
  logo: string;
  supported_payment_methods: string;
  phone_number: number | null;
  phone_numbers: number | null;
  links: string | null;
  location: string | null;
  geolocation: string | null;
  medias: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type CustomerTemplateType = {
  customer_user: number;
  shop: number;
  marked_as_favorite: boolean;
  customer_since: string;
  ejected_customer_since: string | null;
};

export type ArticleTemplateType = {
  article_name: string;
  description: string;
  owner: number;
  creator: number;
  shop_owner: number;
  comment_counter: number;
  like_counter: number;
  dislike_counter: number;
  price: number;
  currency: number;
  initial_stock: number;
  current_stock: number;
  stock_alert: number;
  category: number | null;
  supplier: number | null;
  article_medias: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

export type SessionTemplateType = {
  token: string;
  owner: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ActivationCodeTemplateType = {
  activation_code_value: string;
  targeted_user: number;
  status: boolean;
  code_sent: boolean;
  created_at: string;
  updated_at: string | null;
};

export type StringJson = {
  [member: string]: string | string[];
};

type RuleName =
  | "required"
  | "numeric"
  | "integer"
  | "text"
  | "min"
  | "max"
  | "custom";

type RuleConfig1 = {
  messageOnFail: string;
};

type RuleConfig2 = {
  limit: number | string;
  messageOnFail: string;
};

type RuleConfig3 = {
  minLength?: number;
  maxLength?: number;
  messageOnFail: string;
};

type RuleConfig4 = {
  callback: (data: any) => boolean;
  messageOnFail: string;
};

type RuleObject = {
  required?: RuleConfig1;
  numeric?: RuleConfig1;
  integer?: RuleConfig1;
  text?: RuleConfig3;
  min?: RuleConfig2;
  max?: RuleConfig2;
  custom?: RuleConfig4;
};

export type RuleType = {
  [member: string]: RuleObject;
};

export type UrlRulesType = {
  params?: RuleType;
  query?: RuleType;
};

export type RequestStrategyType = "body" | "params" | "query";

export type NewShopTemplate = {
  owner: number;
  shop_name: string;
  shop_pseudo: string;
  is_public: boolean;
  shop_token: null;
  logo: string;
  supported_payment_methods: string;
  phone_number: null;
  phone_numbers: null;
  links: null;
  location: string;
  geolocation: null;
  medias: null;
  created_at: string;
  updated_at: null;
  deleted_at: null;
};

export type UpdateShopTemplate = {
  shop_name?: string;
  logo?: string;
  phone_number?: number;
  phone_numbers?: string;
  links?: string;
  location?: string;
  geolocation?: string;
  updated_at?: string;
};

export type CustomResponse =
  | {
      failure: boolean;
      report: string;
    }
  | { result: any };

export type NewArticleTemplate = {
  article_name: string;
  description: string;
  cover: string;
  creator: number;
  shop_owner: number;
  comment_counter: number;
  like_counter: number;
  price: number;
  currency: number;
  initial_stock: number;
  current_stock: number;
  stock_alert: number;
  category: null;
  supplier: null;
  article_medias: null;
  created_at: string;
  updated_at: null;
  deleted_at: null;
};

export type UpdateArticleTemplate = {
  article_name?: string;
  description?: string;
  price?: number;
  currency?: number;
  updated_at?: string;
};

export type UpdateArticleCategoryTemplate = {
  category: number | null;
};

export type NewShopCategoryTemplate = {
  category: number;
  creator: number;
  shop_owner: number;
  created_at: string;
  updated_at: null;
  deleted_at: null;
};

export type NewCategoryTemplate = {
  category_name: string;
};

export type UpdateCategoryTemplate = {
  category_name: string;
};

export type LakafSocketRoutingObject<T> = {
  name?: string;
  middlewares: LakafSocketMiddlewareType<T>[];
  controller?: LakafSocketControllerAction<T>;
};

export type LakafSocketServerMiddlewareAction = {
  (socket: Socket, next?: Function): void;
};

export type LakafSocketMiddlewareAction = {
  (socket: Socket, next?: Function): void;
};

export type LakafSocketEventMiddlewareAction<T> = {
  (value: T): boolean;
};

// export type LakafSocketMiddlewareType<T> = {
//   // type: "on-server" | "on-socket" | "in-socket-action";
//   type: "on-server" | "in-socket-action";
//   action:
//     // | LakafSocketMiddlewareAction
//     | LakafSocketServerMiddlewareAction
//     | LakafSocketEventMiddlewareAction<T>;
// };

export type LakafSocketMiddlewareType<T> =
  | {
      type: "in-socket-action";
      action: LakafSocketEventMiddlewareAction<T>;
    }
  | {
      type: "on-server";
      action: LakafSocketServerMiddlewareAction;
    };

export type LakafSocketTools<T> = {
  dispatch?: { (name: string, data: T, callback?: { (data: T): T }): void };
  dispatchTo?: {
    (
      socketId: string,
      name: string,
      data: T,
      callback?: { (data: T): T }
    ): void;
  };
  broadcastDispatching?: {
    (name: string, data: T, callback: { (data: T): T }): void;
  };
};

export type LakafSocketControllerAction<T> = {
  (data: T, socket?: Socket, tools?: LakafSocketTools<T>): void;
};
