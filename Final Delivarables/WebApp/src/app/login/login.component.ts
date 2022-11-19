import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide: boolean = true;
  user_values: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const url = 'http://localhost:5000/get_users';
    this.http.get<any>(url).subscribe(
      (res) => {
        this.user_values = res;
      },
      (error) => {
        this.snackBar.open(error.message, 'Close', { duration: 3000 });
      }
    );

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin() {
    const email_value = this.loginForm.value.email;
    const pass_value = this.loginForm.value.password;
    const userValid = this.user_values.filter((user_value: { email: string; password: string }) => user_value.email == email_value && user_value.password == pass_value);
    if (userValid.length === 1) {
      this.router.navigate(['/user']);
      this.snackBar.open('User logged in successfully', 'Ok', {
        duration: 3000,
      });
    } else {
      this.snackBar.open('User does not exist', 'Close', { duration: 3000 });
    }
  }
}
