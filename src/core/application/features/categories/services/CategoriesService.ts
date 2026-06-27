import DataService from "@application/shared/DataService";
import CategoriesData from "@domain/data/Categories";
import type Category from "@domain/models/Category";
import type ICategoriesService from "./abstraction/ICategoriesService";

export default class CategoriesService extends DataService<Category> implements ICategoriesService {
  protected loadData(): Category[] {
    return CategoriesData;
  }
}
