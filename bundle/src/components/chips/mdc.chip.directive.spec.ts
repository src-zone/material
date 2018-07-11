import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, DebugElement } from '@angular/core';
import { MdcChipSetDirective, MdcChipDirective, MdcChipIconDirective, CHIP_DIRECTIVES } from './mdc.chip.directive';
import { booleanAttributeStyleTest, hasRipple } from '../../testutils/page.test';

describe('MdcChipDirective', () => {
    @Component({
        template: `
            <div [mdcChipSet]="type" id="set">
                <div *ngFor="let chip of chips; let i = index" mdcChip
                        (interact)="interact(chip)"
                        (remove)="remove(i)"
                        (selectedChange)="valueChange(chip,$event)">
                    <i *ngIf="includeLeadingIcon" mdcChipIcon class="material-icons">event</i>
                    <div mdcChipText>{{chip}}</div>
                    <i *ngIf="includeTrailingIcon" class="material-icons" mdcChipIcon (interact)="trailingIconInteract(chip)">cancel</i>
                </div>
            </div>
        `
    })
    class TestComponent {
        includeLeadingIcon = false;
        includeTrailingIcon = false;
        type = 'action';
        chips = ['chippie', 'chappie', 'choppie'];
        interactions = [];
        trailingIconInteractions = [];
        valueChanges = [];
        interact(chip: string) {
            this.interactions.push(chip);
        }
        trailingIconInteract(chip: string) {
            this.trailingIconInteractions.push(chip);
        }
        resetInteractions() {
            this.interactions = [];
            this.trailingIconInteractions = [];
        }
        remove(i: number) {
            this.chips.splice(i, 1);
        }
        valueChange(chip: string, value: boolean) {
            this.valueChanges.push({chip: chip, value: value});
        }
    }

    function setup(testComponentType: any = TestComponent) {
        const fixture = TestBed.configureTestingModule({
            declarations: [...CHIP_DIRECTIVES, testComponentType]
        }).createComponent(testComponentType);
        fixture.detectChanges();
        return { fixture };
    }

    it('apply correct styles for chip and chip-set', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const chipSet: HTMLElement = fixture.nativeElement.querySelector('#set');
        expect(chipSet.classList).toContain('mdc-chip-set');
        const chips = chipSet.querySelectorAll('.mdc-chip');
        expect(chips.length).toBe(3);
        for (let i = 0; i !== chips.length; ++i) {
            let icons = chips.item(i).querySelectorAll('i');
            expect(icons.length).toBe(0);
        }
        testComponent.includeLeadingIcon = true;
        testComponent.includeTrailingIcon = true;
        fixture.detectChanges();
        for (let i = 0; i !== chips.length; ++i) {
            let icons = chips.item(i).querySelectorAll('i');
            expect(icons.length).toBe(2);
            expect(icons.item(0).classList).toContain('mdc-chip__icon');
            expect(icons.item(1).classList).toContain('mdc-chip__icon');
            expect(icons.item(0).classList).toContain('mdc-chip__icon--leading');
            expect(icons.item(1).classList).toContain('mdc-chip__icon--trailing');
        }
    }));

    it('chips have ripples', fakeAsync(() => {
        const { fixture } = setup();
        const chips = fixture.nativeElement.querySelectorAll('.mdc-chip');
        expect(chips.length).toBe(3);
        for (let i = 0; i !== chips.length; ++i)
            expect(hasRipple(chips.item(i))).toBe(true);
    }));

    it('chipset type is one of choice, filter, input, or action', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        const chipSetComponent = fixture.debugElement.query(By.directive(MdcChipSetDirective)).injector.get(MdcChipSetDirective);
        const chipSet: HTMLElement = fixture.nativeElement.querySelector('#set');

        expect(chipSetComponent.mdcChipSet).toBe('action');
        expect(chipSet.getAttribute('class')).toBe('mdc-chip-set');

        for (let type of ['choice', 'filter', 'input']) {
            testComponent.type = type;
            fixture.detectChanges();
            expect(chipSetComponent.mdcChipSet).toBe(type);
            expect(chipSet.classList).toContain('mdc-chip-set--' + type);
        }

        testComponent.type = 'invalid';
        fixture.detectChanges();
        expect(chipSetComponent.mdcChipSet).toBe('action');
        expect(chipSet.getAttribute('class')).toBe('mdc-chip-set');
    }));

    it('trailing icons get a tabindex and role=button', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.chips = ['chip'];
        testComponent.includeLeadingIcon = true;
        testComponent.includeTrailingIcon = true;
        fixture.detectChanges();
        let icons = fixture.nativeElement.querySelectorAll('i');
        expect(icons.length).toBe(2);
        expect(icons[0].tabIndex).toBe(-1);
        expect(icons[0].hasAttribute('role')).toBe(false);
        expect(icons[1].tabIndex).toBe(0);
        expect(icons[1].getAttribute('role')).toBe('button');

        // role/tabIndex changes must be undone when the icon is not a trailing icon anymore:
        const trailingIcon = fixture.debugElement.queryAll(By.directive(MdcChipIconDirective))[1].injector.get(MdcChipIconDirective);
        expect(trailingIcon._elm.nativeElement).toBe(icons[1]);
        trailingIcon._trailing = false;
        expect(icons[1].tabIndex).toBe(-1);
        expect(icons[1].hasAttribute('role')).toBe(false);
    }));

    it('unreachable code for our implementation must throw errors', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.chips = ['chip'];
        fixture.detectChanges();
        const chipSetComponent = fixture.debugElement.query(By.directive(MdcChipSetDirective)).injector.get(MdcChipSetDirective);
        expect(() => {chipSetComponent._adapter.removeChip(null); }).toThrowError();
    }));

    it('click action chip triggers interaction event', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.chips = ['chip'];
        fixture.detectChanges();
        const chip = fixture.nativeElement.querySelector('.mdc-chip');
        const trailingIcon = fixture.nativeElement.querySelector
        
        expect(testComponent.interactions).toEqual([]);
        expect(testComponent.trailingIconInteractions).toEqual([]);
        
        chip.click();
        expect(testComponent.interactions).toEqual(['chip']);
        expect(testComponent.trailingIconInteractions).toEqual([]);
    }));

    it('trailing icon interactions trigger interaction and remove events', fakeAsync(() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = 'input';
        testComponent.chips = ['chip'];
        testComponent.includeTrailingIcon = true;
        fixture.detectChanges();
        const chip = fixture.nativeElement.querySelector('.mdc-chip');
        const trailingIcon = fixture.nativeElement.querySelector('.mdc-chip i:last-child');
        const chipComponent = fixture.debugElement.query(By.directive(MdcChipDirective)).injector.get(MdcChipDirective);
        
        expect(testComponent.interactions).toEqual([]);
        expect(testComponent.trailingIconInteractions).toEqual([]);
        
        trailingIcon.click();
        expect(testComponent.interactions).toEqual([]);
        expect(testComponent.trailingIconInteractions).toEqual(['chip']);
        // simulate transitionend event for exit transition of chip:
        (<any>chipComponent._foundation).handleTransitionEnd({target: chip, propertyName: 'opacity'});
        tick(20); // wait for requestAnimationFrame
        (<any>chipComponent._foundation).handleTransitionEnd({target: chip, propertyName: 'width'});
        expect(testComponent.chips).toEqual([]);
    }));

    it('filter chips get a checkmark icon on selection', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = 'filter';
        fixture.detectChanges();
        const chips = fixture.nativeElement.querySelectorAll('.mdc-chip');
        const svgs = fixture.nativeElement.querySelectorAll('svg');
        
        expect(svgs.length).toBe(3);
        expect(chips[0].classList.contains('mdc-chip--selected')).toBe(false);
        expect(chips[1].classList.contains('mdc-chip--selected')).toBe(false);
        chips[0].click();
        expect(chips[0].classList).toContain('mdc-chip--selected');
        expect(chips[1].classList.contains('mdc-chip--selected')).toBe(false);
        chips[1].click();
        expect(chips[0].classList).toContain('mdc-chip--selected');
        expect(chips[1].classList).toContain('mdc-chip--selected');
        chips[0].click();
        expect(chips[0].classList.contains('mdc-chip--selected')).toBe(false);
        expect(chips[1].classList).toContain('mdc-chip--selected');
    }));

    it('filter chips selected value changes on clicks', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = 'filter';
        fixture.detectChanges();
        const chips = fixture.nativeElement.querySelectorAll('.mdc-chip');

        expect(testComponent.valueChanges).toEqual([]);        
        chips[0].click();
        chips[1].click();
        chips[0].click();
        expect(testComponent.valueChanges).toEqual([
            {chip: 'chippie', value: true},
            {chip: 'chappie', value: true},
            {chip: 'chippie', value: false}
        ]);
    }));

    it('choice chips selected value changes on clicks and clicks of other choices', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = 'choice';
        fixture.detectChanges();
        const chips = fixture.nativeElement.querySelectorAll('.mdc-chip');

        expect(testComponent.valueChanges).toEqual([]);        
        chips[0].click();
        expect(testComponent.valueChanges).toEqual([{chip: 'chippie', value: true}]);
        testComponent.valueChanges = [];
        chips[1].click();
        expect(testComponent.valueChanges).toEqual([{chip: 'chippie', value: false}, {chip: 'chappie', value: true}]);
        testComponent.valueChanges = [];
        chips[1].click();
        expect(testComponent.valueChanges).toEqual([{chip: 'chappie', value: false}]);
    }));

    it('filter/choice chips selected state can be changed', (() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = 'choice';
        fixture.detectChanges();
        const chips = fixture.nativeElement.querySelectorAll('.mdc-chip');
        const chipComponents = fixture.debugElement.queryAll(By.directive(MdcChipDirective)).map(de => de.injector.get(MdcChipDirective));

        expect(chipComponents[0].selected).toBe(false);
        chipComponents[0].selected = true;
        expect(testComponent.valueChanges).toEqual([{chip: 'chippie', value: true}]);
        testComponent.valueChanges = [];

        chipComponents[1].selected = true;
        expect(testComponent.valueChanges).toEqual([{chip: 'chippie', value: false}, {chip: 'chappie', value: true}]);
        expect(chipComponents[0].selected).toBe(false);
        testComponent.valueChanges = [];

        chipComponents[1].selected = true; // no change shouldn't trigger change events
        expect(testComponent.valueChanges).toEqual([]);
        expect(chipComponents[0].selected).toBe(false);
        expect(chipComponents[1].selected).toBe(true);

        chipComponents[1].selected = false;
        expect(testComponent.valueChanges).toEqual([{chip: 'chappie', value: false}]);
        expect(chipComponents[0].selected).toBe(false);
        expect(chipComponents[1].selected).toBe(false);
    }));

    it('filter chips hide their leading icon on selection (to make place for the checkmark)', fakeAsync(() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = 'filter';
        testComponent.chips = ['chip'];
        testComponent.includeLeadingIcon = true;
        fixture.detectChanges();
        const chip = fixture.nativeElement.querySelector('.mdc-chip');
        const chipComponent = fixture.debugElement.query(By.directive(MdcChipDirective)).injector.get(MdcChipDirective);
        const svg = fixture.nativeElement.querySelector('svg');
        const icon = fixture.nativeElement.querySelector('i');
        
        expect(icon.classList.contains('mdc-chip__icon--leading-hidden')).toBe(false);
        
        chip.click();
        // simulate transitionend event for hide animation of icon:
        (<any>chipComponent._foundation).handleTransitionEnd({target: icon, propertyName: 'opacity'});
        expect(icon.classList.contains('mdc-chip__icon--leading-hidden')).toBe(true);

        chip.click();
        // simulate transitionend event for hide animation of checkmark:
        (<any>chipComponent._foundation).handleTransitionEnd({target: svg.parentElement, propertyName: 'opacity'});
        expect(icon.classList.contains('mdc-chip__icon--leading-hidden')).toBe(false);
    }));

    it('computeRippleBoundingRect returns correct values', fakeAsync(() => {
        const { fixture } = setup();
        const testComponent = fixture.debugElement.injector.get(TestComponent);
        testComponent.type = 'filter';
        testComponent.chips = ['chip'];
        testComponent.includeLeadingIcon = true;
        fixture.detectChanges();
        
        let chipComponent = fixture.debugElement.query(By.directive(MdcChipDirective)).injector.get(MdcChipDirective);
        let rect = chipComponent['computeRippleBoundingRect']();
        expect(rect.width).toBeGreaterThan(rect.height);

        testComponent.includeLeadingIcon = false;
        fixture.detectChanges();
        chipComponent = fixture.debugElement.query(By.directive(MdcChipDirective)).injector.get(MdcChipDirective);
        rect = chipComponent['computeRippleBoundingRect']();
        expect(rect.width).toBe(rect.height);
    }));

    @Component({
        template: `
            <div [mdcChipSet]="type" id="set">
                <div mdcChip>
                    <ng-container *ngIf="!contained">
                        <i *ngFor="let icon of beforeIcons" mdcChipIcon class="material-icons before">{{icon}}</i>
                    </ng-container>
                    <div *ngIf="contained">
                        <i *ngFor="let icon of beforeIcons" mdcChipIcon class="material-icons before">{{icon}}</i>
                    </div>
                    <div *ngIf="!contained" mdcChipText>{{chip}}</div>
                    <div *ngIf="contained">
                        <div mdcChipText>{{chip}}</div>
                    </div>
                    <ng-container *ngIf="!contained">
                        <i *ngFor="let icon of afterIcons" class="material-icons after" mdcChipIcon>{{icon}}</i>
                    </ng-container>
                    <div *ngIf="contained">
                        <i *ngFor="let icon of afterIcons" mdcChipIcon class="material-icons before">{{icon}}</i>                    
                    </div>
                </div>
            </div>
        `
    })
    class TestIconsComponent {
        contained = false;
        beforeIcons = [];
        afterIcons = [];
    }
    it('leading/trailing icons are detected properly', (() => {
        const { fixture } = setup(TestIconsComponent);
        const testComponent = fixture.debugElement.injector.get(TestIconsComponent);
        
        let icons = fixture.nativeElement.querySelectorAll('i');
        expect(icons.length).toBe(0);

        testComponent.afterIcons = ['cancel'];
        fixture.detectChanges();
        icons = fixture.nativeElement.querySelectorAll('i');
        expect(icons.length).toBe(1);
        expect(icons[0].classList.contains('mdc-chip__icon--leading')).toBe(false);
        expect(icons[0].classList.contains('mdc-chip__icon--trailing')).toBe(true);
        testComponent.contained = true;
        fixture.detectChanges();
        icons = fixture.nativeElement.querySelectorAll('i');
        expect(icons.length).toBe(1);
        expect(icons[0].classList.contains('mdc-chip__icon--leading')).toBe(false);
        expect(icons[0].classList.contains('mdc-chip__icon--trailing')).toBe(true);

        testComponent.beforeIcons = ['event'];
        testComponent.afterIcons = [];
        fixture.detectChanges();
        icons = fixture.nativeElement.querySelectorAll('i');
        expect(icons.length).toBe(1);
        expect(icons[0].classList.contains('mdc-chip__icon--leading')).toBe(true);
        expect(icons[0].classList.contains('mdc-chip__icon--trailing')).toBe(false);
        testComponent.contained = true;
        fixture.detectChanges();
        icons = fixture.nativeElement.querySelectorAll('i');
        expect(icons.length).toBe(1);
        expect(icons[0].classList.contains('mdc-chip__icon--leading')).toBe(true);
        expect(icons[0].classList.contains('mdc-chip__icon--trailing')).toBe(false);

        testComponent.beforeIcons = ['event', 'event'];
        testComponent.afterIcons = ['cancel', 'cancel'];
        testComponent.contained = false;
        fixture.detectChanges();
        icons = fixture.nativeElement.querySelectorAll('i');
        expect(icons.length).toBe(4);
        expect(icons[0].classList.contains('mdc-chip__icon--leading')).toBe(true);
        expect(icons[0].classList.contains('mdc-chip__icon--trailing')).toBe(false);
        expect(icons[1].classList.contains('mdc-chip__icon--leading')).toBe(false);
        expect(icons[1].classList.contains('mdc-chip__icon--trailing')).toBe(false);
        expect(icons[2].classList.contains('mdc-chip__icon--leading')).toBe(false);
        expect(icons[2].classList.contains('mdc-chip__icon--trailing')).toBe(false);
        expect(icons[3].classList.contains('mdc-chip__icon--leading')).toBe(false);
        expect(icons[3].classList.contains('mdc-chip__icon--trailing')).toBe(true);

        testComponent.contained = true;
        fixture.detectChanges();
        icons = fixture.nativeElement.querySelectorAll('i');
        expect(icons.length).toBe(4);
        expect(icons[0].classList.contains('mdc-chip__icon--leading')).toBe(true);
        expect(icons[0].classList.contains('mdc-chip__icon--trailing')).toBe(false);
        expect(icons[1].classList.contains('mdc-chip__icon--leading')).toBe(false);
        expect(icons[1].classList.contains('mdc-chip__icon--trailing')).toBe(false);
        expect(icons[2].classList.contains('mdc-chip__icon--leading')).toBe(false);
        expect(icons[2].classList.contains('mdc-chip__icon--trailing')).toBe(false);
        expect(icons[3].classList.contains('mdc-chip__icon--leading')).toBe(false);
        expect(icons[3].classList.contains('mdc-chip__icon--trailing')).toBe(true);
    }));

    @Component({
        template: `
            <div mdcChipSet>
                <div mdcChip>
                    <div mdcChipText>one</div>
                </div>
                <div mdcChip tabindex="-1">
                    <div mdcChipText>two</div>
                </div>
            </div>
        `
    })
    class TestTabbingComponent {
    }
    it('chips are tabbable by default, but this can be overridden', (() => {
        const { fixture } = setup(TestTabbingComponent);
        let chips = fixture.nativeElement.querySelectorAll('.mdc-chip');
        expect(chips[0].tabIndex).toBe(0);
        expect(chips[1].tabIndex).toBe(-1);
    }));
});
