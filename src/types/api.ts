export interface ApiResponse<T = any> {
  status: "success" | "error";
  message?: string;
  [key: string]: any;
  token?: string;
  validationErrors?: Array<{ [key: string]: string }>;
}

export interface FileResponse {
  status: "success" | "error";
  message?: string;
  file?: {
    type: "Buffer";
    data: number[];
  };
  validationErrors?: Array<{ [key: string]: string }>;
}
