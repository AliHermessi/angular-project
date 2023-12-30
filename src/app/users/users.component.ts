import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<User[]>(`${this.baseUrl}/users/getAll`).subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error: any) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  saveChanges(name: string, email: string, number: string, user: User): void {
    user.name = name;
    user.email = email;
    user.number = number;
    this.http.put<User>(`${this.baseUrl}/users/update/${user.id}`, user).subscribe(
      (response: User) => {
        console.log('User updated:', response);
        this.fetchUsers();
      },
      (error: any) => {
        console.error('Error updating user:', error);
      }
    );
  }

  deleteUser(userId: number): void {
    this.http.delete(`${this.baseUrl}/users/delete/${userId}`).subscribe(
      () => {
        this.users = this.users.filter((user: User) => user.id !== userId);
        console.log('User deleted:', userId);
      },
      (error: any) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  onImageSelected(event: Event, user: User): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<any>(`${this.baseUrl}/users/uploadImage/${user.id}`, formData).subscribe(
        (response) => {
          console.log('Image uploaded successfully:', response);
          this.saveImage(response.imageUrl, user);
        },
        (error: any) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }

  removeImage(user: User): void {
    user.imageUrl = '';
    this.saveChanges(user.name, user.email, user.number, user);
  }

  saveImage(imageUrl: string, user: User): void {
    user.imageUrl = imageUrl;
    this.saveChanges(user.name, user.email, user.number, user);
  }

  addNewUser(imageUrl:string,name:string,email:string,number:string){
    const newUser: User = { id:0,imageUrl,name,email,number  }; 
    this.http.post<User>(`${this.baseUrl}/users/add`, newUser).subscribe(
      (response: User) => {
        this.fetchUsers(); 
        this.users.push(response);
  
        // Reset input values
        email = '';
        name = '';
        imageUrl='';
        number='0';
        

      },
      (error: any) => {
        console.error('Error adding new user:', error);
      }
    );

  }


}
