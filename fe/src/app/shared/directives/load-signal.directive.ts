import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { ApiResult } from '../../core/services/api.service';
import { ApiErrorComponent } from '../components/api-error/api-error.component';
import { LoadingComponent } from '../components/loading/loading.component';

interface LoadSignalContext<T> {
  $implicit: T;
}

@Directive({
  selector: '[appLoadSignal]',
  standalone: true,
})
export class LoadSignalDirective<T> {
  readonly appLoadSignal = input.required<ApiResult<T> | undefined>();

  private readonly vcr = inject(ViewContainerRef);
  private readonly tpl = inject(TemplateRef<LoadSignalContext<T>>);

  constructor() {
    effect(() => {
      const value = this.appLoadSignal();
      this.vcr.clear();
      if (value === undefined) {
        this.vcr.createComponent(LoadingComponent);
      } else if (!value.success) {
        const ref = this.vcr.createComponent(ApiErrorComponent);
        ref.setInput('message', value.error.message);
      } else {
        this.vcr.createEmbeddedView(this.tpl, { $implicit: value.result });
      }
    });
  }

  static ngTemplateContextGuard<T>(
    _dir: LoadSignalDirective<T>,
    ctx: unknown,
  ): ctx is LoadSignalContext<T> {
    return true;
  }
}
