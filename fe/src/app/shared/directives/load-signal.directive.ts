import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import type { ApiError } from '@party/shared';
import { ApiResult } from '../../core/services/api.service';
import { ApiErrorComponent } from '../components/api-error/api-error.component';
import { LoadingComponent } from '../components/loading/loading.component';

interface LoadSignalContext<T> {
  $implicit: T;
}

interface ErrorTemplateContext {
  $implicit: ApiError;
}

@Directive({
  selector: '[appLoadSignal]',
  standalone: true,
})
export class LoadSignalDirective<T> {
  readonly appLoadSignal = input.required<ApiResult<T> | undefined>();
  readonly appLoadSignalErrorTemplate = input<TemplateRef<ErrorTemplateContext>>();

  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly template = inject(TemplateRef<LoadSignalContext<T>>);

  constructor() {
    effect(() => {
      const value = this.appLoadSignal();
      this.viewContainerRef.clear();
      if (value === undefined) {
        this.viewContainerRef.createComponent(LoadingComponent);
      } else if (!value.success) {
        const errorTemplate = this.appLoadSignalErrorTemplate();
        if (errorTemplate) {
          this.viewContainerRef.createEmbeddedView(errorTemplate, { $implicit: value.error });
        } else {
          const componentReference = this.viewContainerRef.createComponent(ApiErrorComponent);
          componentReference.setInput('message', value.error.message);
        }
      } else {
        this.viewContainerRef.createEmbeddedView(this.template, { $implicit: value.result });
      }
    });
  }

  static ngTemplateContextGuard<T>(
    _directive: LoadSignalDirective<T>,
    _context: unknown,
  ): _context is LoadSignalContext<T> {
    return true;
  }

  static ngTemplateContextGuardError(
    _template: TemplateRef<ErrorTemplateContext>,
    _context: unknown,
  ): _context is ErrorTemplateContext {
    return true;
  }
}
