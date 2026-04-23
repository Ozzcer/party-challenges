import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { LoadingComponent } from '../components/loading/loading.component';

interface LoadSignalContext<T> {
  $implicit: T;
}

@Directive({
  selector: '[appLoadSignal]',
  standalone: true,
})
export class LoadSignalDirective<T> {
  readonly appLoadSignal = input.required<T | undefined>();

  private readonly vcr = inject(ViewContainerRef);
  private readonly tpl = inject(TemplateRef<LoadSignalContext<T>>);

  constructor() {
    effect(() => {
      const value = this.appLoadSignal();
      this.vcr.clear();
      if (value === undefined) {
        this.vcr.createComponent(LoadingComponent);
      } else {
        this.vcr.createEmbeddedView(this.tpl, { $implicit: value });
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
