import type Certification from "@domain/models/Certification";
import type { IListable } from "@packages/acore-ts/repository/abstraction/IRepository";

export default interface ICertificationsService extends IListable<Certification> {}
