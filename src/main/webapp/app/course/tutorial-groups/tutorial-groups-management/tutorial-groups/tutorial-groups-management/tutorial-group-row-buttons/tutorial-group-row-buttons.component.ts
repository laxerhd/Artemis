import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { TutorialGroup } from 'app/entities/tutorial-group/tutorial-group.model';
import { faCalendarAlt, faTrash, faUsers, faWrench } from '@fortawesome/free-solid-svg-icons';
import { EMPTY, Subject, from } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { TutorialGroupsService } from 'app/course/tutorial-groups/services/tutorial-groups.service';
import { Course } from 'app/entities/course.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RegisteredStudentsComponent } from 'app/course/tutorial-groups/tutorial-groups-management/registered-students/registered-students.component';
import { TutorialGroupSessionsManagementComponent } from 'app/course/tutorial-groups/tutorial-groups-management/tutorial-group-sessions/tutorial-group-sessions-management/tutorial-group-sessions-management.component';
import { catchError, takeUntil } from 'rxjs/operators';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateDirective } from 'app/shared/language/translate.directive';
import { RouterLink } from '@angular/router';
import { DeleteButtonDirective } from 'app/shared/delete-dialog/delete-button.directive';

@Component({
    selector: 'jhi-tutorial-group-row-buttons',
    templateUrl: './tutorial-group-row-buttons.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FaIconComponent, TranslateDirective, RouterLink, DeleteButtonDirective],
})
export class TutorialGroupRowButtonsComponent implements OnDestroy {
    private tutorialGroupsService = inject(TutorialGroupsService);
    private modalService = inject(NgbModal);

    ngUnsubscribe = new Subject<void>();

    @Input() isAtLeastInstructor = false;
    @Input() course: Course;
    @Input() tutorialGroup: TutorialGroup;

    @Output() tutorialGroupDeleted = new EventEmitter<void>();
    @Output() registrationsChanged = new EventEmitter<void>();
    @Output() attendanceUpdated = new EventEmitter<void>();

    private dialogErrorSource = new Subject<string>();
    dialogError$ = this.dialogErrorSource.asObservable();

    faWrench = faWrench;
    faUsers = faUsers;
    faTrash = faTrash;
    faCalendar = faCalendarAlt;

    public constructor() {}

    openSessionDialog(event: MouseEvent) {
        event.stopPropagation();
        const modalRef: NgbModalRef = this.modalService.open(TutorialGroupSessionsManagementComponent, {
            scrollable: false,
            backdrop: 'static',
            animation: false,
            windowClass: 'session-management-dialog',
        });
        modalRef.componentInstance.course = this.course;
        modalRef.componentInstance.tutorialGroupId = this.tutorialGroup.id!;
        modalRef.componentInstance.initialize();
        from(modalRef.result)
            .pipe(
                catchError(() => EMPTY),
                takeUntil(this.ngUnsubscribe),
            )
            .subscribe(() => {
                this.attendanceUpdated.emit();
            });
    }

    openRegistrationDialog(event: MouseEvent) {
        event.stopPropagation();
        const modalRef: NgbModalRef = this.modalService.open(RegisteredStudentsComponent, { size: 'xl', scrollable: false, backdrop: 'static', animation: false });
        modalRef.componentInstance.course = this.course;
        modalRef.componentInstance.tutorialGroupId = this.tutorialGroup.id!;
        modalRef.componentInstance.initialize();
        from(modalRef.result)
            .pipe(
                catchError(() => EMPTY),
                takeUntil(this.ngUnsubscribe),
            )
            .subscribe(() => {
                this.registrationsChanged.emit();
            });
    }

    deleteTutorialGroup = () => {
        this.tutorialGroupsService
            .delete(this.course.id!, this.tutorialGroup.id!)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe({
                next: () => {
                    this.dialogErrorSource.next('');
                    this.tutorialGroupDeleted.emit();
                },
                error: (error: HttpErrorResponse) => this.dialogErrorSource.next(error.message),
            });
    };

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.dialogErrorSource.unsubscribe();
    }
}
