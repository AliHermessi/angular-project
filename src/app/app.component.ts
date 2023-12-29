import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  testService: any;
  testMessage: string | undefined;


  title = 'angular-project';
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
