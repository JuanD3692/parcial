import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageFlashService } from '../components/message-flash/message-flash.service';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  api = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private messageFlash: MessageFlashService
  ) {}

  getEndPoint(endpoint: string) {
    return `${this.api}/${endpoint}`;
  }

  get<T>(path: string) {
    const headers = this.getHttpHeader();
    const endpoint = this.getEndPoint(path);

    return this.http
      .get<T>(endpoint, { headers })
      .pipe(catchError((error) => this.handleError(error)));
  }

  post<T>(path: string, body: any) {
    const headers = this.getHttpHeader();
    const endpoint = this.getEndPoint(path);
    return this.http
      .post<T>(endpoint, body, { headers })
      .pipe(catchError((error) => this.handleError(error)));
  }

  put<T>(path: string, body?: any) {
    const headers = this.getHttpHeader();
    const endpoint = this.getEndPoint(path);
    return this.http
      .put<T>(endpoint, body, { headers })
      .pipe(catchError((error) => this.handleError(error)));
  }

  delete<T>(path: string) {
    const headers = this.getHttpHeader();
    const endpoint = this.getEndPoint(path);
    return this.http
      .delete<T>(endpoint, { headers })
      .pipe(catchError((error) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error status:', error.status);
    console.error('Error details:', error.message);
    console.error('Error body:', error.error);

    if ('successful' in error.error) {
      this.messageFlash.danger(error.error.message);
    } else {
      this.messageFlash.danger(error.error.message);
    }

    return throwError(() => new Error('Error interno del servidor'));
  }

  private getHttpHeader() {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn(
        'No se encontró un token. Las solicitudes pueden fallar si se requiere autorización.'
      );
    }

    return headers;
  }

  private getToken() {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    console.warn('localStorage no está disponible en este entorno.');
    return null;
  }
}
