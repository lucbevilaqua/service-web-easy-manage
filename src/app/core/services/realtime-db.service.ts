import { Injectable, signal } from '@angular/core';
import { 
  getDatabase, 
  Database, 
  ref, 
  get, 
  query, 
  limitToFirst, 
  limitToLast,
  startAt,
  endAt,
  orderByChild,
  orderByKey,
  orderByValue,
  QueryConstraint,
  Query,
  DatabaseReference
} from 'firebase/database';
import { FirebaseService } from './firebase.service';

export interface RealtimeDbQueryOptions {
  path: string;
  pageSize?: number;
  orderBy?: 'key' | 'value' | string; // 'key', 'value', or child path
  startAtValue?: any;
  endAtValue?: any;
  searchTerm?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeDbService {
  private readonly db = signal<Database | null>(null);
  private readonly loading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);

  constructor(private firebaseService: FirebaseService) {
    this.initialize();
  }

  private initialize(): void {
    if (this.firebaseService.isInitialized()) {
      const app = this.firebaseService.getApp();
      if (app) {
        this.db.set(getDatabase(app));
      }
    }
  }

  isLoading(): boolean {
    return this.loading();
  }

  getError(): string | null {
    return this.error();
  }

  async getData<T = any>(options: RealtimeDbQueryOptions): Promise<T[]> {
    const db = this.db();
    if (!db) {
      throw new Error('Realtime Database not initialized');
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const {
        path,
        pageSize,
        orderBy: orderByOption,
        startAtValue,
        endAtValue
      } = options;

      let dbRef: DatabaseReference | Query = ref(db, path);
      const constraints: QueryConstraint[] = [];

      // Apply ordering
      if (orderByOption === 'key') {
        constraints.push(orderByKey());
      } else if (orderByOption === 'value') {
        constraints.push(orderByValue());
      } else if (orderByOption) {
        constraints.push(orderByChild(orderByOption));
      }

      // Apply range
      if (startAtValue !== undefined) {
        constraints.push(startAt(startAtValue));
      }
      if (endAtValue !== undefined) {
        constraints.push(endAt(endAtValue));
      }

      // Apply pagination
      if (pageSize) {
        constraints.push(limitToFirst(pageSize));
      }

      if (constraints.length > 0) {
        dbRef = query(dbRef, ...constraints);
      }

      const snapshot = await get(dbRef);
      const data: T[] = [];

      if (snapshot.exists()) {
        const value = snapshot.val();
        if (Array.isArray(value)) {
          data.push(...value);
        } else if (typeof value === 'object') {
          Object.keys(value).forEach(key => {
            data.push({ id: key, ...value[key] } as T);
          });
        } else {
          data.push(value as T);
        }
      }

      this.loading.set(false);
      return data;
    } catch (err: any) {
      this.error.set(err.message || 'Error fetching data');
      this.loading.set(false);
      throw err;
    }
  }
}

