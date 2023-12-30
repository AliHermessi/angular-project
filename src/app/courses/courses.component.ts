import { Component, numberAttribute, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../course';
import { stringify } from 'querystring';


@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.refreshCourses();
  }

  refreshCourses(): void {
    this.http.get<Course[]>(`${this.baseUrl}/courses/getAll`).subscribe(
      (data: Course[]) => {
        this.courses = data;
      },
      (error: any) => {
        console.error('Error fetching courses:', error);
        if (error.status === 404) {
          console.error('Courses not found:', error.error);
        } else {
          console.error('Unexpected error occurred:', error.error);
        }
      }
    );
  }

  saveChanges(title: string, description: string, price: string, duration: string, course: Course): void {
    // Update course fields
    course.title = title;
    course.description = description;
    course.price = parseFloat(price);
    course.durationInHours = parseFloat(duration);

    this.http.put<Course>(`${this.baseUrl}/courses/update/${course.id}`, course).subscribe(
      (response: Course) => {
        console.log('Course updated:', response);
        this.refreshCourses(); // Refresh the table after update
      },
      (error: any) => {
        console.error('Error updating course:', error);
      }
    );
  }
  
  deleteCourse(courseId: number): void {
    this.http.delete(`${this.baseUrl}/courses/delete/${courseId}`).subscribe(
      () => {
        this.courses = this.courses.filter((course: Course) => course.id !== courseId);
        console.log('Course deleted:', courseId);
        this.refreshCourses(); // Refresh the table after deletion
      },
      (error: any) => {
        console.error('Error deleting course:', error);
      }
    );
  }
  onImageSelected(event: Event, course: Course): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const formData = new FormData();
      formData.append('file', file);
  
      this.http.post(`${this.baseUrl}/courses/uploadImage/${course.id}`, formData, { responseType: 'text' }).subscribe(
        (response) => {
          console.log('Image upload response:', response);
          
          if (typeof response === 'string' && response.includes('Image uploaded successfully')) {
            const imageUrl = response.split('Image URL: ')[1]; // Extracting the URL from the response
            if (imageUrl) {
              this.saveImage(imageUrl, course);
              this.saveChanges(course.title, course.description, course.price.toString(), course.durationInHours.toString(), course);
            } else {
              console.error('Image URL not found in the server response.');
            }
          } else {
            console.error('Unexpected server response:', response);
          }
        },
        (error: any) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }
  
  
  
  saveImage(imageUrl: string, course: Course): void {
    course.imageUrl = imageUrl; 

    this.http.put<Course>(`${this.baseUrl}/courses/update/${course.id}`, course).subscribe(
      (response: Course) => {
        console.log('Course image updated:', response);
        this.saveChanges(course.title, course.description, course.price.toString(), course.durationInHours.toString(), course);
        
      },
      (error: any) => {
        console.error('Error updating course image:', error);
      }
    );}

  removeImage(course: Course): void {
    course.imageUrl = ''; 
    this.saveChanges(course.title, course.description, course.price.toString(), course.durationInHours.toString(), course);
  }


  addNewCourse(imageUrl:string,title: string, description: string, price: number, durationInHours: number): void {
    
      const newCategory: Course = { id:0,imageUrl, title , description,price,durationInHours }; 
      this.http.post<Course>(`${this.baseUrl}/categories/add`, newCategory).subscribe(
        (response: Course) => {
          this.refreshCourses(); 
          this.courses.push(response);
    
          // Reset input values
          title = '';
          description = '';
          imageUrl='';
          price=0;
          durationInHours=0;

        },
        (error: any) => {
          console.error('Error adding new category:', error);
        }
      );
    
  }
  



}
