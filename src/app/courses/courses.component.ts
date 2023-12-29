import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  courses: Course[] = []; // Initialize courses as an empty array
  testMessage: string | undefined;
testmessage: string="nigawat?";
  private baseUrl = 'http://localhost:8081';
  testService: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
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

  fetchTestMessage(): void {
    this.testService.getTestMessage().subscribe(
      (data: string) => {
        this.testMessage = data;
      },
      (error: any) => {
       this.testMessage="??????????"
      }
    );
  }


}