import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertService, AuthenticationService, UserService} from '@app/_services';
import {first} from 'rxjs/operators';

@Component({templateUrl: 'register.component.html'})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.registerForm.controls;
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            lastName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            username: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        console.log(JSON.stringify(this.registerForm.value));
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                () => {
                },
                error => {
                    if (error.status === 200) {
                        this.alertService.success(String(error.error.text), true);
                        this.router.navigate(['/login']);
                    } else {
                        this.alertService.error(String(error.error));
                        this.loading = false;
                    }
                });
    }
}
