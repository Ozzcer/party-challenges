import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private readonly API_ENDPOINT = '/api';

  constructor(private http: HttpClient) {}

  public get<T>(path: string): Observable<ApiResult<T>> {
    return this.applyPipes(this.http.get<T>(this.API_ENDPOINT + path));
  }

  public post<T>(path: string, body: unknown): Observable<ApiResult<T>> {
    return this.applyPipes(this.http.post<T>(this.API_ENDPOINT + path, body));
  }

  private applyPipes<T>(request: Observable<T>): Observable<ApiResult<T>> {
    return request.pipe(
      map(result => this.mapResult(result)),
      catchError((err): Observable<ApiResult<T>> => this.handleError(err)),
    )
  }

  private mapResult<T>(result: T): ApiResult<T> {
    return {
      success: true,
      result,
      error: null,
    }
  }

  private handleError<T>(err: unknown): Observable<ApiResult<T>>
  {
    const body = err instanceof HttpErrorResponse ? err.error : err;
    const error = isApiError(body) ? body : this.generateDefaultApiError();
      return of({
        success: false,
        result: null,
        error,
      })
    }
  

  private generateDefaultApiError(): ApiError {
    return {
      message: 'Something went wrong, please try again later',
      statusCode: 500,
      name: 'Error', 
    }
  }
}

export type ApiResult<T> = {
  success: true;
  result: T
  error: null;
} | {
  success: false;
  result: null;
  error: ApiError;
}

export interface ApiError extends Error {
  message: string;
  statusCode: number;
  name: string;
  internalMessage?: string;
  stack?: string;
  originalError?: unknown;
}

export function isApiError(error: unknown): error is ApiError {
  if(error === null || error === undefined) return false;
  if(typeof error !== 'object') return false;
  return 'statusCode' in error && 'message' in error && 'name' in error;
}
