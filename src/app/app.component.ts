import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todoApp';
  form: FormGroup;
  tomorrow = new Date();
  
  constructor(private fb: FormBuilder){
    this.tomorrow.setDate(this.tomorrow.getDate() +1);
  }

  ngOnInit(){
    this.form = this.fb.group({
      task: this.fb.control('', [Validators.required]),
      priority: this.fb.control('', [Validators.required]),
      dueDate: this.fb.control('', [Validators.required])
      
    });
  }

  getPriorityErrorMessage(){
    if (this.form.get('priority').hasError('required')) {
      return 'You must enter a value';
    }
  }

  addTodo(){
    console.log("add todo");
  }
}
