import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MdcChipSetDirective, MdcChipDirective, MdcChipIconDirective, CHIP_DIRECTIVES } from './mdc.chip.directive';
import { hasRipple, simulateKey } from '../../testutils/page.test';

describe('MdcChipDirective', () => {
    @Component({
        template: `
            <div [mdcChipSet]="type" id="set">
                <div *ngFor="let chip of chips; let i = index" mdcChip
                        [value]="chip.startsWith('__') ? undefined : chip"
                        (interact)="interact(chip)"
                        (remove)="remove(i)"
                        (selectedChange)="valueChange(chip,$event)">
                    <i *ngIf="includeLeadingIcon" mdcChipIcon class="material-icons">event</i>
                    <span mdcChipCell>
                        <span mdcChipPrimaryAction>
                            <div mdcChipText>{{chip}}</div>
                        </span>
                    </span>
                    <span *ngIf="includeTrailingIcon" mdcChipCell>
                        <i *ngIf="includeTrailingIcon" class="material-icons" mdcChipIcon (interact)="trailingIconInteract(chip)">cancel</i>
                    </span>
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
        const testComponent = fixture.debugElement.injector.get(testComponentType);
        const chipSetComponent = fixture.debugElement.query(By.directive(MdcChipSetDirective)).injector.get(MdcChipSetDirective);
        const chipSet: HTMLElement = fixture.nativeElement.querySelector('#set');
        return { fixture, testComponent, chipSetComponent, chipSet };
    }

    it('apply correct styles for chip and chip-set', (() => {
        const { fixture, testComponent, chipSet } = setup();
        expect(chipSet.classList).toContain('mdc-chip-set');
        const chips = chipSet.querySelectorAll('.mdc-chip');
        expect(chips.length).toBe(3);
        // only one chip/interactionIcon should be tabbable at a time:
        expect(chipSet.querySelectorAll('[tabindex]:not([tabindex="-1"])').length).toBe(1);
        for (let i = 0; i !== chips.length; ++i) {
            expect(chips.item(i).classList.contains('mdc-chip--deletable')).toBe(true);
            const icons = chips.item(i).querySelectorAll('i');
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

    it('chips get values (either via binding or auto-assigned)', fakeAsync(() => {
        const { fixture, testComponent } = setup();
        testComponent.chips = ['one', '__two', 'three'];
        fixture.detectChanges();
        // for some weird reason this returns every MdcChipDirective twice, hence the construct to remove duplicates:
        const chipComponents = fixture.debugElement.queryAll(By.directive(MdcChipDirective)).map(de => de.injector.get(MdcChipDirective))
            .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
        expect(chipComponents.length).toBe(3);
        expect(chipComponents[0].value).toBe('one');
        expect(chipComponents[1].value).toMatch(/mdc-chip-.*/);
        expect(chipComponents[2].value).toBe('three');
    }));

    it('chipset type is one of choice, filter, input, or action', (() => {
        const { fixture, testComponent, chipSetComponent, chipSet } = setup();
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

    it('trailing icons get a role=button and are navigatable', fakeAsync(() => {
        const { fixture, testComponent } = setup();
        testComponent.chips = ['chip1', 'chip2'];
        testComponent.includeLeadingIcon = true;
        testComponent.includeTrailingIcon = true;
        fixture.detectChanges(); tick();
        let primaryActions = [...fixture.nativeElement.querySelectorAll('.mdc-chip__primary-action')];
        expect(primaryActions.length).toBe(2);
        expect(primaryActions.map(a => a.tabIndex)).toEqual([0, -1]);
        let icons = [...fixture.nativeElement.querySelectorAll('i')];
        expect(icons.length).toBe(4);
        expect(icons.map(i => i.tabIndex)).toEqual([-1, -1, -1, -1]);
        expect(icons.map(i => i.getAttribute('role'))).toEqual([null, 'button', null, 'button']);

        // ArrowRight/ArrowLeft changes focus and tabbable item:
        primaryActions[0].focus();
        simulateKey(primaryActions[0], 'ArrowRight');
        // trailing action of first chip now is tabbable and has focus:
        expect(document.activeElement).toBe(icons[1]);
        expect(primaryActions.map(a => a.tabIndex)).toEqual([-1, -1]);
        expect(icons.map(i => i.tabIndex)).toEqual([-1, 0, -1, -1]);

        // role/tabIndex changes must be undone when the icon is not a trailing icon anymore:
        const trailingIcon = fixture.debugElement.queryAll(By.directive(MdcChipIconDirective))[1].injector.get(MdcChipIconDirective);
        expect(trailingIcon._elm.nativeElement).toBe(icons[1]);
        trailingIcon._trailing = false;
        fixture.detectChanges();
        expect(icons[1].tabIndex).toBe(-1);
        expect(icons[1].hasAttribute('role')).toBe(false);
    }));

    it('unreachable code for our implementation must throw errors', (() => {
        const { fixture, testComponent, chipSetComponent } = setup();
        testComponent.chips = ['chip'];
        fixture.detectChanges();
        expect(() => {chipSetComponent._adapter.removeChipAtIndex(null); }).toThrowError();
    }));

    it('click action chip triggers interaction event', (() => {
        const { fixture, testComponent } = setup();
        testComponent.chips = ['chip'];
        fixture.detectChanges();
        const chip = fixture.nativeElement.querySelector('.mdc-chip');
        
        expect(testComponent.interactions).toEqual([]);
        expect(testComponent.trailingIconInteractions).toEqual([]);
        
        chip.click();
        expect(testComponent.interactions).toEqual(['chip']);
        expect(testComponent.trailingIconInteractions).toEqual([]);
    }));

    it('trailing icon interactions trigger interaction and remove events', fakeAsync(() => {
        const { fixture, testComponent } = setup();
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

    it('after chip removal, next remaining chip has focus and is tabbable', fakeAsync(() => {
        const { fixture, testComponent } = setup();
        testComponent.type = 'input';
        testComponent.chips = ['chip1', 'chip2', 'chip3'];
        testComponent.includeTrailingIcon = true;
        fixture.detectChanges();
        const chips: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-chip')];
        const primaryActions: HTMLElement[] = chips.map(c => c.querySelector('.mdc-chip__primary-action'));
        const trailingIcons: HTMLElement[] = chips.map(c => c.querySelector('i:last-child'));
        // for some weird reason this returns every MdcChipDirective twice when executed on Github Actions,
        // (it doesn't when run locally with test/test:watch/test:ci, and also doesn't on circleci...),
        // hence the construct to remove duplicates:
        const chipComponents = fixture.debugElement.queryAll(By.directive(MdcChipDirective)).map(de => de.injector.get(MdcChipDirective))
            .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
        expect(chipComponents.length).toBe(3);
        
        expect(primaryActions[0].tabIndex).toBe(0);
        simulateKey(primaryActions[0], 'ArrowRight');
        expect(trailingIcons[0].tabIndex).toBe(0);
        simulateKey(trailingIcons[0], 'ArrowRight');
        expect(primaryActions[1].tabIndex).toBe(0);
        simulateKey(primaryActions[1], 'ArrowRight');
        expect(trailingIcons[1].tabIndex).toBe(0);
        expect(document.activeElement).toBe(trailingIcons[1]);
        trailingIcons[1].click();

        expect(testComponent.interactions).toEqual([]);
        expect(testComponent.trailingIconInteractions).toEqual(['chip2']);
        // simulate transitionend event for exit transition of chip:
        (<any>chipComponents[1]._foundation).handleTransitionEnd({target: chips[1], propertyName: 'opacity'});
        tick(20); // wait for requestAnimationFrame
        (<any>chipComponents[1]._foundation).handleTransitionEnd({target: chips[1], propertyName: 'width'});
        expect(testComponent.chips).toEqual(['chip1', 'chip3']);
        expect([...fixture.nativeElement.querySelectorAll('.mdc-chip__primary-action')].map(a => a.tabIndex)).toEqual([-1, -1]);
        expect([...fixture.nativeElement.querySelectorAll('.mdc-chip')]
            .map(c => c.querySelector('i:last-child').tabIndex)).toEqual([-1, 0]);
        expect(document.activeElement).toBe([...fixture.nativeElement.querySelectorAll('.mdc-chip')]
            .map(c => c.querySelector('i:last-child'))[1]);
    }));

    it('after chip list changes, always exactly one chip or trailingIcon should be tabbable', fakeAsync(() => {
        const { fixture, testComponent } = setup();
        testComponent.type = 'input';
        testComponent.chips = ['chip1', 'chip2', 'chip3'];
        testComponent.includeTrailingIcon = true;
        fixture.detectChanges();

        while (testComponent.chips.length) {
            expect(fixture.nativeElement.querySelectorAll('.mdc-chip').length).toBe(testComponent.chips.length);
            expect(fixture.nativeElement.querySelectorAll('[tabindex]:not([tabindex="-1"])').length).toBe(1);
            testComponent.chips.splice(0, 1);
            fixture.detectChanges();
        }
        expect(fixture.nativeElement.querySelectorAll('.mdc-chip').length).toBe(0);
        expect(fixture.nativeElement.querySelectorAll('[tabindex]:not([tabindex="-1"])').length).toBe(0);
    }));

    it('filter chips get a checkmark icon on selection', (() => {
        const { fixture, testComponent } = setup();
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
        const { fixture, testComponent } = setup();
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
        const { fixture, testComponent } = setup();
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

    it('filter/choice chips selected state can be changed', fakeAsync(() => {
        const { fixture, testComponent } = setup();
        testComponent.type = 'choice';
        fixture.detectChanges();
        // for some weird reason this returns every MdcChipDirective twice, hence the construct to remove duplicates:
        const chipComponents = fixture.debugElement.queryAll(By.directive(MdcChipDirective)).map(de => de.injector.get(MdcChipDirective))
            .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
        expect(chipComponents.length).toBe(3);

        expect(chipComponents[0].selected).toBe(false);
        chipComponents[0].selected = true;
        expect(testComponent.valueChanges).toEqual([{chip: 'chippie', value: true}]);
        testComponent.valueChanges = [];

        chipComponents[1].selected = true;
        expect(testComponent.valueChanges).toEqual(jasmine.arrayWithExactContents([{chip: 'chippie', value: false}, {chip: 'chappie', value: true}]));
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
        const { fixture, testComponent } = setup();
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
        const { fixture, testComponent } = setup();
        testComponent.type = 'filter';
        testComponent.chips = ['chip'];
        testComponent.includeLeadingIcon = true;
        fixture.detectChanges();
        
        let chipComponent = fixture.debugElement.query(By.directive(MdcChipDirective)).injector.get(MdcChipDirective);
        let chip = fixture.nativeElement.querySelector('div.mdc-chip');
        let rect = chipComponent['computeRippleBoundingRect']();
        expect(rect.height).toBe(32);
        expect(rect.width).toBe(chip.getBoundingClientRect().width);

        testComponent.includeLeadingIcon = false;
        fixture.detectChanges();
        let checkmark = fixture.nativeElement.querySelector('div.mdc-chip__checkmark');
        rect = chipComponent['computeRippleBoundingRect']();
        expect(rect.height).toBe(32);
        expect(rect.width).toBe(chip.getBoundingClientRect().width + checkmark.getBoundingClientRect().height);
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
                    <span mdcChipCell>
                        <span mdcChipPrimaryAction>
                            <div mdcChipText>{{chip}}</div>
                        </span>
                    </span>
                    <span *ngFor="let icon of afterIcons" mdcChipCell>
                        <ng-container *ngIf="!contained">
                            <i class="material-icons after" mdcChipIcon>{{icon}}</i>
                        </ng-container>
                        <div *ngIf="contained">
                            <i mdcChipIcon class="material-icons before">{{icon}}</i>
                        </div>
                    </span>
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
        const { fixture, testComponent } = setup(TestIconsComponent);
        
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
                    <i mdcChipIcon class="material-icons leading" tabindex="0">event</i>
                    <span mdcChipCell>
                        <span mdcChipPrimaryAction>
                            <div mdcChipText>one</div>
                        </span>
                    </span>
                    <span mdcChipCell>
                        <i mdcChipIcon class="material-icons">cancel</i>
                    </span>
                </div>
                <div mdcChip>
                    <i mdcChipIcon class="material-icons leading">event</i>
                    <span mdcChipCell>
                        <span mdcChipPrimaryAction tabindex="-1">
                            <div mdcChipText>two</div>
                        </span>
                    </span>
                    <span mdcChipCell>
                        <i mdcChipIcon class="material-icons" tabindex="-1">cancel</i>
                    </span>
                </div>
                <div mdcChip>
                    <i mdcChipIcon class="material-icons leading">event</i>
                    <span mdcChipCell>
                        <span mdcChipPrimaryAction tabindex="99">
                            <div mdcChipText>three</div>
                        </span>
                    </span>
                    <span mdcChipCell>
                        <i mdcChipIcon class="material-icons" tabindex="100">cancel</i>
                    </span>
                </div>
            </div>
        `
    })
    class TestTabbingComponent {
    }
    it('chips trailing icons tabIndex is controlled by chipset, other icons tabindex can be overridden', (() => {
        const { fixture } = setup(TestTabbingComponent);
        let actions = fixture.nativeElement.querySelectorAll('.mdc-chip__primary-action');
        expect(actions[0].tabIndex).toBe(-1); // initial -1, because last chip was initialized with a tabIndex, so that is taken as the first focusable chip
        expect(actions[1].tabIndex).toBe(-1);
        expect(actions[2].tabIndex).toBe(99);
        let trailingIcons = fixture.nativeElement.querySelectorAll('.mdc-chip__icon--trailing');
        expect(trailingIcons[0].tabIndex).toBe(-1);
        expect(trailingIcons[1].tabIndex).toBe(-1);
        expect(trailingIcons[2].tabIndex).toBe(-1); // because primaryAction is already tabbable
        let leadingIcons = fixture.nativeElement.querySelectorAll('.leading');
        expect(leadingIcons[0].tabIndex).toBe(0); // untouched, because leading icon
        expect(leadingIcons[1].tabIndex).toBe(-1);
        expect(leadingIcons[2].tabIndex).toBe(-1);
    }));

    @Component({
        template: `
            <div mdcChipSet>
                <div mdcChip>
                    <i mdcChipIcon class="material-icons" role="custom-role">event</i>
                    <span mdcChipCell>
                        <span mdcChipPrimaryAction>
                            <div mdcChipText>one</div>
                        </span>
                    </span>
                    <span mdcChipCell>
                        <i mdcChipIcon class="material-icons" role="custom-role">cancel</i>
                    </span>
                </div>
            </div>
        `
    })
    class TestIconRoleComponent {
    }
    it('chips icons can override their aria role', (() => {
        const { fixture } = setup(TestIconRoleComponent);
        let icons = fixture.nativeElement.querySelectorAll('.mdc-chip__icon');
        expect(icons[0].getAttribute('role')).toBe('custom-role');
        expect(icons[1].getAttribute('role')).toBe('custom-role');
    }));

    @Component({
        template: `
            <div [mdcChipSet]="type" id="set">
                <div *ngFor="let chip of chips; let i = index" mdcChip="input"
                    removable="false"
                    (remove)="remove(i)">
                    <span mdcChipCell>
                        <span mdcChipPrimaryAction>
                            <div mdcChipText>{{chip}}</div>
                        </span>
                    </span>
                    <span mdcChipCell>
                        <i class="material-icons" mdcChipIcon (interact)="trailingIconInteract(chip)">cancel</i>
                    </span>
                </div>
            </div>
        `
    })
    class TestNotRemobvableComponent {
        chips = ['chippie', 'chappie', 'choppie'];
        trailingIconInteractions = [];
        removed = [];
        trailingIconInteract(chip: string) {
            this.trailingIconInteractions.push(chip);
        }
        resetInteractions() {
            this.trailingIconInteractions = [];
        }
        remove(i: number) {
            this.chips.splice(i, 1);
        }
    }

    it('removable property must prevent removal', fakeAsync(() => {
        const { fixture, testComponent } = setup(TestNotRemobvableComponent);
        const chips: HTMLElement[] = [...fixture.nativeElement.querySelectorAll('.mdc-chip')];
        const trailingIcons = fixture.nativeElement.querySelectorAll('.mdc-chip i:last-child');
        // for some weird reason this returns every MdcChipDirective twice, hence the construct to remove duplicates:
        const chipComponents = fixture.debugElement.queryAll(By.directive(MdcChipDirective)).map(de => de.injector.get(MdcChipDirective))
            .reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
        expect(testComponent.trailingIconInteractions).toEqual([]);
        expect(chips.map(c => c.classList.contains('mdc-chip--deletable'))).toEqual([false, false, false]);
        
        trailingIcons[1].click();
        // simulate transitionend event for exit transition of chip:
        (<any>chipComponents[1]._foundation).handleTransitionEnd({target: chips[1], propertyName: 'opacity'});
        tick(20); // wait for requestAnimationFrame
        (<any>chipComponents[1]._foundation).handleTransitionEnd({target: chips[1], propertyName: 'width'});

        // there was an interaction:
        expect(testComponent.trailingIconInteractions).toEqual(['chappie']);
        // but nothing was deleted:
        expect(testComponent.chips).toEqual(['chippie', 'chappie', 'choppie']);
    }));
});
