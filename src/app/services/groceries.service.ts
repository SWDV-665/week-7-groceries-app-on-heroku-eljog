import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Item } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {
  private items: Item[] = [];

  private baseUrl = "https://grocery-server-eljo.herokuapp.com";
  private dataChangeSubject: Subject<boolean>;

  public dataChanged$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

  /**
   * Remove the item with given id.
   * @param id item id.
   */
  public removeItem(id: string) {
    this.http.delete(`${this.baseUrl}/api/groceries/${id}`).subscribe((res: Item[]) => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

  /**
   * Add a new item.
   * @param item the item to add.
   */
  public addItem(item: Item) {
    this.http.post(`${this.baseUrl}/api/groceries`, item).subscribe((res: Item[]) => {
      this.items = res;
      this.dataChangeSubject.next(true);
    })
  }

  /**
   * Update the item at given index.
   * @param item the item to update.
   */
  public editItem(item: Item) {
    this.http.put(`${this.baseUrl}/api/groceries/${item._id}`, item).subscribe((res: Item[]) => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

  /**
   * Get a list of all the items
   * @returns list of items
   */
  public getItems(): Observable<Item[]> {
    return this.http.get(`${this.baseUrl}/api/groceries`).pipe(
      map((res: Item[]) => {
        return res || [];
      }),
      catchError(this.handleError<Item[]>('getItems', [])),
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
