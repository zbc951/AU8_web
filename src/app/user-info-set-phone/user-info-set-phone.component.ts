import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { AuthService } from './../app-service/auth.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormsModule, Validators } from '@angular/forms';
import { MemberService } from '../app-service/member.service';


@Component({
  selector: 'app-user-info-set-phone',
  templateUrl: './user-info-set-phone.component.html',
  // styleUrls: ['./user-info-set-phone.component.scss']
})
export class UserInfoSetPhoneComponent implements OnInit {
  private user;
  oldPhone;

  form;
  private info;

  invalidErrors = {
    phone: '',
  };

  translations;

  @Output() closeEvt = new EventEmitter();

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private toastService: ToastService,
    private langService: LangService
  ) {

    this.langService.onloadSub
      .subscribe((boo) => {

        if (boo) {
          // this.setTxt(this.langService.translations);
          this.translations = this.langService.translations;
        }
      });

    this.form = this.formBuilder
      .group({
        account: '',
        name: '',
        email: "",
        phone: new FormControl({ value: '', disabled: false }, Validators.required),
        smsCode: new FormControl({ value: '', disabled: false }, Validators.required),
        birth: '',
        line: null,
        wechat: null
      });

    this.form.controls.phone
      .valueChanges
      .subscribe((phone) => {
        this.invalidErrors.phone = (phone.length == 10) ? '' : this.translations.REGISTER.INVALID.PHONE_NUM_LIMIT;

      });


    this.info = this.auth.info;
    console.log(this.info);
    this.oldPhone = this.info.phone;

    for (const key in this.info) {
      if (this.info.hasOwnProperty(key)) {
        const element = this.info[key];

        if (element) {

          const ctrl = this.form.get(key);
          if (ctrl) {
            ctrl.patchValue(element);
          }
        }
      }
    }

    console.log('form', this.form.value);


  }

  ngOnInit(): void {
  }

  getCode(): void {
    // console.log(this.infoForm);

    this.memberService
      .bindPhone({ phone: this.form.value.phone })
      .subscribe(
        () => {
        },
        ({ error }) => {
          console.log('err', error);

          if (typeof error == 'string') {

            this.toastService.error(error);
            return;

          }

          this.toastService.error(error.message);

        });
  }

  updateInfo(): void {
    this.memberService.updateInfo(this.form.value)
      .subscribe(
        (res: any) => {

          console.log('res', res);

          if (res?.refresh?.user) {
            this.auth.user = res.refresh.user;
          }

          // server ??? ????????????, ????????????????????? ?????????
          if (!res.data.isAutoPass && res.data.isReview) {

            console.log('***');
            this.toastService.error(this.langService.translations.MEMBER_WITHDRAW.APPLYING);


          } else {

            // this.toastService.error(this.updatedTxt, 3000);

            this.toastService.error(this.langService.translations.MEMBER_INFO.updated, 3000);
          }


        },
        (err) => {

          console.log('err', err);
          if (err.error.errors) {

            // Object.assign(this.invalidErrors, err.error.errors);
            // console.log('invalidErrors', this.invalidErrors);
          } else {

            if (typeof err.error == 'string') {

              this.toastService.error(err.error, 3000);
              return;
            }

            this.toastService.error(err.error.message, 3000);
          }
        }
      )
      .add(() => {

        //why bank-card.component this.bankService.add subscribe third function works?
        // console.log('***final test***');

        this.close();

      });


  }

  isValidtoSend() {
    return (this.form.get('smsCode').value && this.form.get('phone').value.length == 10)
  }

  close(): void {
    this.closeEvt.emit();
  }


}
