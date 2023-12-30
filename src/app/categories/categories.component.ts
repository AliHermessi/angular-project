import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../category'; // Replace 'Category' with the actual category model

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  private baseUrl = 'http://localhost:8081'; // Update the base URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.http.get<Category[]>(`${this.baseUrl}/categories/getAll`).subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  saveChanges(name: string, description: string, category: Category): void {
    category.name = name;
    category.description = description;

    this.http.put<Category>(`${this.baseUrl}/categories/update/${category.id}`, category).subscribe(
      (response: Category) => {
        console.log('Category updated:', response);
        this.fetchCategories(); 
      },
      (error: any) => {
        console.error('Error updating category:', error);
      }
    );
  }

  deleteCategory(categoryId: number): void {
    this.http.delete(`${this.baseUrl}/categories/delete/${categoryId}`).subscribe(
      () => {
        this.categories = this.categories.filter((category: Category) => category.id !== categoryId);
        console.log('Category deleted:', categoryId);
      },
      (error: any) => {
        console.error('Error deleting category:', error);
      }
    );
  }


  addNewCategory(name: string, description: string): void {
    const newCategory: Category = { id: 0, name, description }; 
    this.http.post<Category>(`${this.baseUrl}/categories/add`, newCategory).subscribe(
      (response: Category) => {
        this.fetchCategories(); 
        this.categories.push(response);
  
        // Reset input values
        name = '';
        description = '';
      },
      (error: any) => {
        console.error('Error adding new category:', error);
      }
    );
  }
  
  



}
