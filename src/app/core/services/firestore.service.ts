import { Injectable, signal, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  getDocs, 
  QueryConstraint,
  Query,
  orderBy,
  limit,
  startAfter,
  where,
  WhereFilterOp,
  DocumentSnapshot,
  Timestamp,
  doc,
  deleteDoc,
  addDoc,
  updateDoc
} from 'firebase/firestore';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';

export interface FirestoreQueryOptions {
  path: string;
  pageSize?: number;
  orderByField?: string;
  orderByDirection?: 'asc' | 'desc';
  lastDoc?: DocumentSnapshot;
  searchTerm?: string;
  searchFields?: string[];
  filters?: Record<string, { operator: WhereFilterOp; value: any }>;
}

export interface FirestorePageResult<T> {
  data: T[];
  lastDoc: DocumentSnapshot | null;
  hasMore: boolean;
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private readonly angularFirestore = inject(AngularFirestore);
  private readonly db = signal<Firestore | null>(null);
  private readonly loading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      // Use the Firestore instance from @angular/fire
      const db = this.angularFirestore as any;
      if (db) {
        this.db.set(db);
        console.log('Firestore initialized successfully');
      } else {
        console.warn('Firestore instance is null');
      }
    } catch (error) {
      console.error('Error initializing Firestore:', error);
    }
  }

  isLoading(): boolean {
    return this.loading();
  }

  getError(): string | null {
    return this.error();
  }

  async getPaginatedData<T = any>(options: FirestoreQueryOptions): Promise<FirestorePageResult<T>> {
    const db = this.db();

    if (!db) {
      throw new Error('Firestore not initialized');
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const {
        path,
        pageSize = 10,
        orderByField,
        orderByDirection = 'asc',
        lastDoc,
        searchTerm,
        searchFields = [],
        filters = {}
      } = options;

      // Normalize path (remove leading slash if present)
      const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
      
      console.log('Firestore query:', {
        path: normalizedPath,
        pageSize,
        orderByField,
        orderByDirection,
        filtersCount: Object.keys(filters).length,
        searchTerm
      });

      const constraints: QueryConstraint[] = [];

      // Apply filters
      Object.entries(filters).forEach(([field, { operator, value }]) => {
        constraints.push(where(field, operator, value));
      });

      // Apply ordering
      if (orderByField) {
        constraints.push(orderBy(orderByField, orderByDirection));
      }

      // Apply pagination
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }
      constraints.push(limit(pageSize + 1)); // Get one extra to check if there's more

      let q: Query = query(collection(db, normalizedPath), ...constraints);

      const snapshot = await getDocs(q);
      console.log('Firestore snapshot:', {
        size: snapshot.size,
        empty: snapshot.empty,
        docs: snapshot.docs.length
      });
      const docs = snapshot.docs;
      const hasMore = docs.length > pageSize;
      const data = (hasMore ? docs.slice(0, pageSize) : docs).map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      const newLastDoc = docs.length > 0 ? docs[hasMore ? pageSize - 1 : docs.length - 1] : null;

      // If search term is provided, filter client-side (Firestore doesn't support full-text search)
      let filteredData = data;
      if (searchTerm && searchFields.length > 0) {
        const term = searchTerm.toLowerCase();
        filteredData = data.filter(item => 
          searchFields.some(field => {
            const value = this.getNestedValue(item, field);
            return String(value).toLowerCase().includes(term);
          })
        );
      }

      this.loading.set(false);
      return {
        data: filteredData,
        lastDoc: newLastDoc || null,
        hasMore
      };
    } catch (err: any) {
      this.error.set(err.message || 'Error fetching data');
      this.loading.set(false);
      throw err;
    }
  }

  async getCollectionData<T = any>(path: string): Promise<T[]> {
    const db = this.db();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const snapshot = await getDocs(collection(db, path));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];

      this.loading.set(false);
      return data;
    } catch (err: any) {
      this.error.set(err.message || 'Error fetching data');
      this.loading.set(false);
      throw err;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
  }

  // Helper to convert Firestore Timestamp to Date
  convertTimestamp(timestamp: Timestamp | any): Date {
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return new Date(timestamp);
  }

  async deleteDocument(path: string, documentId: string): Promise<void> {
    const db = this.db();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const docRef = doc(db, path, documentId);
      await deleteDoc(docRef);
      this.loading.set(false);
    } catch (err: any) {
      this.error.set(err.message || 'Error deleting document');
      this.loading.set(false);
      throw err;
    }
  }

  async createDocument(path: string, data: any): Promise<string> {
    const db = this.db();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      // Add timestamp
      const dataWithTimestamp = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, path), dataWithTimestamp);
      this.loading.set(false);
      return docRef.id;
    } catch (err: any) {
      this.error.set(err.message || 'Error creating document');
      this.loading.set(false);
      throw err;
    }
  }

  async updateDocument(path: string, documentId: string, data: any): Promise<void> {
    const db = this.db();
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const docRef = doc(db, path, documentId);
      
      // Add updated timestamp
      const dataWithTimestamp = {
        ...data,
        updatedAt: new Date()
      };

      await updateDoc(docRef, dataWithTimestamp);
      this.loading.set(false);
    } catch (err: any) {
      this.error.set(err.message || 'Error updating document');
      this.loading.set(false);
      throw err;
    }
  }
}

