import axios, { AxiosInstance } from "axios";
import { injectable } from "inversify";

export interface AxiosProvider {}

@injectable()
export class AxiosProviderImpl implements AxiosProvider {
  private readonly _axiosClient: AxiosInstance;

  constructor() {
    this._axiosClient = axios.create({
      baseURL: "https://api.domain.com/api/v1/",
      timeout: 30000,
    });
  }

  public axiosClient(): AxiosInstance {
    return this._axiosClient;
  }
}
