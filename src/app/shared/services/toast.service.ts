import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ToastService {
  private readonly DEFAULT_LIFE_TIME = 3000;

  constructor(
    private messages: MessageService,
    private translate: TranslateService
  ) {}

  public spinner(msg: string) {
    this.messages.add({
      severity: 'info',
      summary: this.translate.instant(msg),
      sticky: true,
      closable: false,
      life: this.DEFAULT_LIFE_TIME,
      key: 'withSpinner',
    });
  }

  public clearSpinner() {
    this.messages.clear('withSpinner');
  }

  public error(msg: { summary: string; detail?: string } | string) {
    this.message('error', msg);
  }

  public info(msg: { summary: string; detail: string } | string) {
    this.message('info', msg);
  }

  public warn(msg: { summary: string; detail: string } | string) {
    this.message('warn', msg);
  }

  public success(msg: { summary: string; detail: string } | string) {
    this.message('success', msg);
  }

  private message(
    severity: string,
    msg: { summary: string; detail?: string } | string
  ) {
    const summary =
      typeof msg === 'string'
        ? this.translate.instant(
            `TOAST_MESSAGE.SEVERITY.${severity.toUpperCase()}`
          )
        : this.translate.instant(msg.summary);
    const detail =
      typeof msg === 'string'
        ? this.translate.instant(msg)
        : this.translate.instant(msg.detail!);
    this.messages.add({
      severity,
      life: this.DEFAULT_LIFE_TIME,
      summary,
      detail,
    });
  }

  public clear(key: string) {
    this.messages.clear(key);
  }
}
