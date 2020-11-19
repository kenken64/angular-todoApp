import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todoApp';
  form: FormGroup;
  tomorrow = new Date();
  todoValues = [];
  editTaskid: string;
  isEditMode: boolean = false;

  constructor(private fb: FormBuilder){
    this.tomorrow.setDate(this.tomorrow.getDate() +1);
  }

  ngOnInit(){
    this.form = this.fb.group({
      task: this.fb.control('', [Validators.required]),
      priority: this.fb.control('', [Validators.required]),
      dueDate: this.fb.control('', [Validators.required]),
      todos: new FormArray([]),
    });
  }

  getPriorityErrorMessage(){
    if (this.form.get('priority').hasError('required')) {
      return 'You must enter a value';
    }
  }

  updateTodo(){

  }

  addTodo(){
    console.log("add todo");
    console.log(this.form.value.task);
    console.log(this.form.value.dueDate);
    console.log(this.form.value.priority);
    const todosWithChkbox : FormArray = this.form.get('todos') as FormArray;
    let taskId = uuidv4();
    console.log(taskId);
    let singleTodo = new Todo(
      this.form.value.task,
      this.form.value.priority,
      this.form.value.dueDate,
      taskId
    );
    this.todoValues.push(singleTodo);
    const todoGroup = this.fb.group({
      task: this.fb.control(false)
    });
    todosWithChkbox.push(todoGroup);
    this.form.get('task').reset();
    this.form.get('priority').reset();
    this.form.get('dueDate').reset();
    // get from localstorage then update the todo array??
    localStorage.setItem(taskId, JSON.stringify(singleTodo));
  }
  
  updateStatus(index){
    this.todoValues[index].status=true;
  }

  onDelete(index, taskId){
    console.log(index);
    console.log(taskId);
    
    const todosWithChkbox : FormArray = this.form.get('todos') as FormArray;
    
    todosWithChkbox.removeAt(index);
    let deleteRecordFound = this.todoValues.findIndex((i)=> i.taskId === taskId);
    if(index > -1){
      this.todoValues.splice(deleteRecordFound, 1);
    }
    localStorage.removeItem(taskId);
  }

  onEdit(index, taskId){
    console.log(index);
    console.log(taskId);
    this.editTaskid = taskId;
    this.isEditMode = true;

  }
}
