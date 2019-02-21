import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Task} from '@app/_models/task';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Reminder} from '@app/_models/reminder';
import {Project} from '@app/_models/project';

@Injectable({providedIn: 'root'})
export class TaskService {
    private httpHeaders: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    constructor(private http: HttpClient) {
    }

    addTask(task: Task, projectId: number): Observable<Task> {
        return this.http.post('http://localhost:8080/project/' + projectId + '/addTask', JSON.stringify(task), {headers: this.httpHeaders})
            .pipe(tap((t: Task) => ('Added task: ' + t.name)));
    }

    updateTask(task: Task, projectId: number): Observable<Task> {
        return this.http.post('http://localhost:8080/project/' + projectId + '/task/update', JSON.stringify(task), {headers: this.httpHeaders})
            .pipe(tap((t: Task) => console.log('updated task: ' + t.name)));
    }

    getReminders(taskId: number): Observable<Reminder[]> {
        return this.http.get('http://localhost:8080/task/' + taskId + '/reminders').pipe(tap((tab: Reminder[]) => console.log('daskjd')));
    }

    getProjects(): Observable<Project[]> {
        return this.http.get('http://localhost:8080/project/all').pipe(tap((tab: Project[]) => console.log('daskjd')));
    }

    addProject(project: Project): Observable<Project> {
        return this.http.post('http://localhost:8080/project/add', JSON.stringify(project), {headers: this.httpHeaders})
            .pipe(tap((p: Project) => console.log('Project added')));
    }

    updateProject(project: Project): Observable<Project> {
        return this.http.post('http://localhost:8080/project/update', JSON.stringify(project), {headers: this.httpHeaders})
            .pipe(tap((p: Project) => console.log('updated project: ' + p.name)));
    }
}
