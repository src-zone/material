import { Observable, ReplaySubject } from 'rxjs';

export class ThemeService {
    theme: ReplaySubject<string> = new ReplaySubject<string>(1);

    setTheme(theme: string) {
        this.theme.next(theme);
    }

    get theme$(): Observable<string> {
        return this.theme.asObservable();
    }
}
