import { NgForm } from '@angular/forms';

export function markControlsAsTouched(form: NgForm) {
    for (let name in form.controls)
        if (form.controls.hasOwnProperty(name))
            form.controls[name].markAsTouched();
}
