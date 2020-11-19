import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray, FormGroupDirective } from '@angular/forms';
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

  taskFormControl = new FormControl('', [Validators.required]);
  priorityFormControl = new FormControl('', [Validators.required]);
  dueDateFormControl = new FormControl('', [Validators.required]);
  
  constructor(private fb: FormBuilder){
    this.tomorrow.setDate(this.tomorrow.getDate() +1);
  }

  ngOnInit(){
    this.form = this.fb.group({
      task: this.taskFormControl,
      priority: this.priorityFormControl,
      dueDate: this.dueDateFormControl,
      todos: new FormArray([]),
    });
  }

  getPriorityErrorMessage(){
    if (this.form.get('priority').hasError('required')) {
      return 'You must enter a value';
    }
  }

  addTodo(){
    const todosWithChkbox : FormArray = this.form.get('todos') as FormArray;
    let taskId = uuidv4();
    let singleTodo = new Todo(
      this.form.value.task,
      this.form.value.priority,
      this.form.value.dueDate,
      taskId
    );
    this.todoValues.push(singleTodo);
    const todoGroup = this.fb.group({
      taskCheckbox: this.fb.control(false),
    });
    todosWithChkbox.push(todoGroup);
    this.taskFormControl.reset();
    this.priorityFormControl.reset();
    this.dueDateFormControl.reset();
    localStorage.setItem(taskId, JSON.stringify(singleTodo));
  }
  
  updateStatus(index){
    if(this.todoValues[index].status){
      this.todoValues[index].status=false;
    }else{
      this.todoValues[index].status=true;
    }
  }

  onDelete(index, taskId){
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
    this.editTaskid = taskId;
    this.isEditMode = true;
    let editTodoIdx = this.todoValues.findIndex((i)=> i.taskId === taskId);
    this.form.patchValue(this.todoValues[editTodoIdx]); 
  }

  cancelEdit(formDirective? : FormGroupDirective){
    this.isEditMode = false;
    this.form.reset();
    formDirective.resetForm();
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key).setErrors(null) ;
    });
    this.taskFormControl.setValidators([Validators.required]);
    this.taskFormControl.updateValueAndValidity();
    this.priorityFormControl.setValidators([Validators.required]);
    this.priorityFormControl.updateValueAndValidity();
    this.dueDateFormControl.setValidators([Validators.required]);
    this.dueDateFormControl.updateValueAndValidity();
  }
  
  updateEdit(){
    let singleTodo = new Todo(
      this.form.value.task,
      this.form.value.priority,
      this.form.value.dueDate,
      this.editTaskid
    );
    let updateRecordFound = this.todoValues.findIndex((i)=> i.taskId === this.editTaskid);
    this.todoValues[updateRecordFound] = singleTodo;
    localStorage.setItem(this.editTaskid, JSON.stringify(singleTodo));
    this.isEditMode = false; 
  }
}
