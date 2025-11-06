import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";
import { GlobalService } from "../../services/global.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private globalService: GlobalService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    // throw new Error("Invalid login response");
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    try {
      console.log('Login form submitted:', this.loginForm.value);
      const formData = this.loginForm.value;

      const loginDetail = await this.globalService.post("auth/login", formData);
      console.log("apiCall::",loginDetail);
      const username = loginDetail?.user?.username;
      const token = loginDetail?.token;
      if (!username || !token) {
        throw new Error("Invalid login response");
      }
      this.authService.login(loginDetail.user.username, loginDetail.token, 24 * 60 * 60);
      this.router.navigate(['/chats']);
    } catch (error: any) {
      console.error("Login failed:", error);
    }
    

  }
}
