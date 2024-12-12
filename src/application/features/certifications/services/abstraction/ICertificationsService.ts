import type { IListable } from "~/core/acore-ts/repository/abstraction/IRepository";
import type Certification from "~/domain/models/Certification";

export default interface ICertificationsService extends IListable<Certification> {}
