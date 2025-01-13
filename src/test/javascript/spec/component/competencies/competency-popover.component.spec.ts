import { Location } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ArtemisTranslatePipe } from 'app/shared/pipes/artemis-translate.pipe';
import { MockComponent, MockPipe } from 'ng-mocks';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CompetenciesPopoverComponent } from 'app/course/competencies/competencies-popover/competencies-popover.component';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ArtemisTestModule } from '../../test.module';

@Component({
    selector: 'jhi-statistics',
    template: '',
})
class DummyStatisticsComponent {}

@Component({
    selector: 'jhi-course-management',
    template: '',
})
class DummyManagementComponent {}

describe('CompetencyPopoverComponent', () => {
    let competencyPopoverComponentFixture: ComponentFixture<CompetenciesPopoverComponent>;
    let competencyPopoverComponent: CompetenciesPopoverComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ArtemisTestModule,
                NgbPopoverModule,
                RouterModule.forRoot([
                    { path: 'courses/:courseId/competencies', component: DummyStatisticsComponent },
                    { path: 'course-management/:courseId/competency-management', component: DummyManagementComponent },
                ]),
            ],
            declarations: [CompetenciesPopoverComponent, MockPipe(ArtemisTranslatePipe), MockComponent(FaIconComponent), DummyStatisticsComponent, DummyManagementComponent],
            providers: [],
            schemas: [],
        })
            .compileComponents()
            .then(() => {
                competencyPopoverComponentFixture = TestBed.createComponent(CompetenciesPopoverComponent);
                competencyPopoverComponent = competencyPopoverComponentFixture.componentInstance;
            });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should initialize', () => {
        competencyPopoverComponentFixture.detectChanges();
        expect(competencyPopoverComponent).toBeDefined();
    });

    it.each([
        ['courseCompetencies', '/courses/1/competencies'],
        ['competencyManagement', '/course-management/1/competency-management'],
    ])(
        'should navigate',
        fakeAsync((navigateTo: 'competencyManagement' | 'courseCompetencies', expectedPath: string) => {
            const location: Location = TestBed.inject(Location);
            competencyPopoverComponent.navigateTo = navigateTo;
            competencyPopoverComponent.competencyLinks = [{ competency: { id: 1, title: 'competency' }, weight: 1 }];
            competencyPopoverComponent.courseId = 1;
            competencyPopoverComponentFixture.detectChanges();
            const popoverButton = competencyPopoverComponentFixture.debugElement.nativeElement.querySelector('button');
            popoverButton.click();
            tick();
            const anchor = competencyPopoverComponentFixture.debugElement.query(By.css('a')).nativeElement;
            anchor.click();
            tick();
            expect(location.path()).toBe(expectedPath);
        }),
    );
});
