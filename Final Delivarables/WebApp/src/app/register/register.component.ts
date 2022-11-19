import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hide: boolean = true;
  rehide: boolean = true;
  value: boolean = false;
  pass: boolean = false;
  user_values: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder,
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

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister() {
    this.value =
      this.registerForm.value.email != null &&
      this.registerForm.value.password != null;
    this.pass =
      this.registerForm.value.password === this.registerForm.value.repassword;
    if (!this.pass) {
      this.snackBar.open('Please enter the password correctly', 'Ok', {
        duration: 3000,
      });
      return;
    }
    const email_value = this.registerForm.value.email;
    const userValid = this.user_values.filter(
      (user_value: { email: string }) => user_value.email == email_value
    );
    if (userValid.length === 1) {
      this.snackBar.open('Email exists already', 'Ok', {
        duration: 3000,
      });
      return
    }
    if (this.value && this.pass && userValid.length!=1) {
      let Form = new FormData();
      Form.append('email', this.registerForm.value.email);
      Form.append('password', this.registerForm.value.password);
      const url = 'http://localhost:5000/add_user';
      this.http.post<any>(url, Form).subscribe(
        (res) => {
          this.snackBar.open('Account created successfully', 'Ok', {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open(error.message, 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please enter all the details', 'Ok', {
        duration: 3000,
      });
    }
    this.router.navigate(['/login']);
  }
}
