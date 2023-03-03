import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CustomValidators } from '../../../shared/validators/CustomValidators';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-campaign-form.component',
  templateUrl: './campaign-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignFormComponent implements OnInit {
  public products: SelectItem[] = [
    { label: 'Product A', value: 'Product A' },
    { label: 'Product B', value: 'Product B' },
    { label: 'Product C', value: 'Product C' },
    { label: 'Product D', value: 'Product D' },
  ];

  public campaignForm = new FormGroup({
    campaignName: new FormControl('', [
      Validators.required,
      CustomValidators.isNotWhiteSpace,
      Validators.minLength(1),
      Validators.maxLength(15),
    ]),
    eampId: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Z]{3}\/\d{5}\/(0[1-9]|1[0-2])\/\d{2}$/gm),
    ]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    productLine: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}
  public ngOnInit(): void {}

  public addCampaign() {}
}
