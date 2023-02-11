import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/shared/token.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthStateService } from 'src/app/shared/auth-state.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private token: TokenService,
    private authState: AuthStateService,
    private message: NzMessageService) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {

  }
  submitForm(): void {

    this.authService.signin(this.loginForm.value).subscribe(
      (result) => {
        this.responseHandler(result);
        for (const i in this.loginForm.controls) {
          this.loginForm.controls[i].markAsDirty();
          this.loginForm.controls[i].updateValueAndValidity();
        }
      },
      (error) => {
        this.message.create('error', `Error ${error}`);

      },
      () => {
        this.authState.setAuthState(true);
        this.loginForm.reset();
        this.router.navigate(['/admin/manage-questions']);
      }
    );

  }
  // Handle response
  responseHandler(data: any) {
    this.token.handleData(data.access_token);
  }
}
