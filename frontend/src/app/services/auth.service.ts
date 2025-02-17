import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthResponse } from '../models/AuthResponse'; 
import { environment } from '../../environments/environment.development';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly USER_KEY = 'authenticatedUser'; // Chiave per localStorage
  private readonly TOKEN_KEY = 'authToken'; // Chiave per il token in localStorage

  // BehaviorSubject che tiene traccia dello stato di autenticazione
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthenticationStatus());
  
  constructor(private http: HttpClient) {}

  // Metodo per ottenere lo stato di autenticazione come Observable
  getAuthenticationStatus(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Verifica se l'utente è autenticato (controllando la presenza del token)
  private checkAuthenticationStatus(): boolean {
    const token = this.getToken();
    return token ? true : false; // Se c'è un token, l'utente è autenticato
  }

  // Registrazione (Sign Up)
  signUp(username: string, password: string, role: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/api/auth/signup`, { username, password, role });
  }

  // Login
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/api/auth/login`, { username, password });
  }

  // Salva il token in localStorage
  setToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      // Dopo aver salvato il token, aggiorniamo lo stato di autenticazione
      this.isAuthenticatedSubject.next(true); // Imposta lo stato di autenticazione a true
    } catch (error) {
      console.error('Errore nel salvataggio del token:', error);
    }
  }

  // Salva l'utente autenticato in localStorage
  setAuthenticatedUser(user: User): void {
    try {
      const userJson = JSON.stringify(user);
      localStorage.setItem(this.USER_KEY, userJson);
    } catch (error) {
      console.error('Errore nel salvataggio dell\'utente autenticato:', error);
    }
  }

  // Recupera l'utente autenticato
  getAuthenticatedUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) {
      return null;
    }
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Errore nel parsing di userData:', error);
      return null;
    }
  }

  // Ottieni il token da localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Verifica se l'utente è autenticato
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value; // Restituisce il valore attuale del BehaviorSubject
  }

  // Logout (rimuove il token e l'utente)
  logout(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      // Dopo il logout, aggiorniamo lo stato di autenticazione
      this.isAuthenticatedSubject.next(false); // Imposta lo stato di autenticazione a false
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }
}
