import DataService from "@application/shared/DataService";
import TechnologiesData from "@domain/data/Technologies";
import type Technology from "@domain/models/Technology";
import type ITechnologiesService from "./abstraction/ITechnologiesService";

export default class TechnologiesService extends DataService<Technology> implements ITechnologiesService {
  protected loadData(): Technology[] {
    return TechnologiesData;
  }
}
