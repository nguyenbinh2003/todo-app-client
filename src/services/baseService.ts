import axios, { AxiosInstance } from "axios";

class BaseServices {
  baseURL: string;
  http: AxiosInstance;
  configHeaders: any;

  constructor(baseURL: string, configHeaders: any) {
    this.http = axios.create({
      baseURL: baseURL,
      timeout: 100000,
    });
    this.baseURL = baseURL;
    this.configHeaders = configHeaders;

    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        if (response) {
          switch (response.status) {
            case 400:
              return response;
            case 401:
              localStorage.clear();
              window.location.reload();
              return response;
            case 403:
              // window.location.href = "/error";
              return response;

            case 404:
              return response;
            default:
              // return Promise.reject(error);
              return response;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setConfigHeaders() {
    const userToken = localStorage.getItem("user-token");
    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      ...this.configHeaders,
    };
    return config;
  }

  get(url: string, configHeaders?: any) {
    return this.http.get(url, { ...this.setConfigHeaders(), ...configHeaders });
  }
  post(url: string, data: any, configHeaders?: any) {
    return this.http.post(url, data, {
      ...this.setConfigHeaders(),
      ...configHeaders,
    });
  }

  /**
   * Sends a PUT request to the specified URL with the provided data and headers.
   *
   * @param {string} url - The URL to send the request to.
   * @param {object} data - The data to send with the request (default: {}).
   * @param {object} configHeaders - Additional headers to include in the request (default: undefined).
   * @return {Promise} A Promise that resolves with the response from the server.
   */
  put(url: string, data: object, configHeaders?: object): Promise<any> {
    return this.http.put(url, data, {
      ...this.setConfigHeaders(),
      ...configHeaders,
    });
  }

  patch(url: string, data: object, configHeaders?: object): Promise<any> {
    return this.http.patch(url, data, {
      ...this.setConfigHeaders(),
      ...configHeaders,
    });
  }

  delete(url: string, data?: any, configHeaders?: object): Promise<any> {
    return this.http.delete(url, {
      data,
      ...this.setConfigHeaders(),
      ...configHeaders,
    });
  }
}

export default BaseServices;