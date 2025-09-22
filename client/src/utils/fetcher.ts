import axios, { AxiosResponse, isAxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { toast } from "sonner";

interface GetType {
  endpointPath: string;
  statusShouldBe?: number;
  onError?: (err?: Error) => void;
}

interface GeneralMethodType extends GetType {
  data: unknown;
}

class Fetcher {
  private baseUrl: null | string = null;

  constructor() {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) throw new Error("NEXT_PUBLIC_API_URL is not defined");
    this.baseUrl = url;
  }

  private config = {
    withCredentials: true,
  };

  private handleError(error: unknown, onError?: () => void) {
    if (onError) onError();
    if (isAxiosError(error)) {
      toast.error(error.response?.data?.error ?? "Something went wrong");
    } else {
      console.error(error);
    }
  }

  private handleStatusCheck(
    status: number,
    statusShouldBe: number,
    onError?: () => void
  ) {
    if (status !== statusShouldBe) {
      if (onError) onError();
    }
  }

  private async tryCatchWrapper<T>(
    caller: () => Promise<AxiosResponse<T, unknown>>,
    statusShouldBe: number,
    onError?: () => void
  ) {
    try {
      const response = await caller();

      this.handleStatusCheck(response.status, statusShouldBe, onError);

      if (!response.data) throw new ApiError(500, "No data found");

      return response.data;
    } catch (error) {
      this.handleError(error, onError);
      return null;
    }
  }

  async get<T>({ endpointPath, statusShouldBe = 200, onError }: GetType) {
    return await this.tryCatchWrapper<T>(
      async () => {
        return await axios.get<T>(
          `${this.baseUrl}${endpointPath}`,
          this.config
        );
      },
      statusShouldBe,
      onError
    );
  }

  async post<T>({
    endpointPath,
    data,
    statusShouldBe = 200,
    onError,
  }: GeneralMethodType) {
    return await this.tryCatchWrapper<T>(
      async () => {
        return await axios.post<T>(
          `${this.baseUrl}${endpointPath}`,
          data,
          this.config
        );
      },
      statusShouldBe,
      onError
    );
  }

  async patch<T>({
    endpointPath,
    data,
    statusShouldBe = 200,
    onError,
  }: GeneralMethodType) {
    return await this.tryCatchWrapper<T>(
      async () => {
        return await axios.patch<T>(
          `${this.baseUrl}${endpointPath}`,
          data,
          this.config
        );
      },
      statusShouldBe,
      onError
    );
  }
}

const fetcher = new Fetcher();
export default fetcher;
