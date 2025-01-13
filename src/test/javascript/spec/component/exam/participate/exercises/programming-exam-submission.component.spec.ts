import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Course } from 'app/entities/course.model';
import { ExerciseGroup } from 'app/entities/exercise-group.model';
import { ProgrammingExerciseStudentParticipation } from 'app/entities/participation/programming-exercise-student-participation.model';
import { ProgrammingExercise } from 'app/entities/programming/programming-exercise.model';
import { ProgrammingSubmission } from 'app/entities/programming/programming-submission.model';
import { ProgrammingExamSubmissionComponent } from 'app/exam/participate/exercises/programming/programming-exam-submission.component';
import { CommitState } from 'app/exercises/programming/shared/code-editor/model/code-editor.model';
import { ArtemisTestModule } from '../../../../test.module';

describe('ProgrammingExamSubmissionComponent', () => {
    let fixture: ComponentFixture<ProgrammingExamSubmissionComponent>;
    let component: ProgrammingExamSubmissionComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ArtemisTestModule],
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ProgrammingExamSubmissionComponent);
                component = fixture.componentInstance;
            });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const newExercise = () => {
        return new ProgrammingExercise(new Course(), new ExerciseGroup());
    };

    const newParticipation = () => {
        const programmingSubmission = new ProgrammingSubmission();
        programmingSubmission.commitHash = 'Hash commit';
        programmingSubmission.buildFailed = false;
        programmingSubmission.buildArtifact = false;

        const participation = new ProgrammingExerciseStudentParticipation();
        participation.submissions = [programmingSubmission];

        return participation;
    };

    it('should change state on commit', () => {
        component.studentParticipation = newParticipation();

        component.onCommitStateChange(CommitState.UNDEFINED);
        expect(component.hasSubmittedOnce).toBeFalse();

        component.onCommitStateChange(CommitState.CLEAN);

        // After the first call with CommitState.CLEAN, component.hasSubmittedOnce must be now true
        expect(component.hasSubmittedOnce).toBeTrue();

        component.onCommitStateChange(CommitState.CLEAN);

        expect(component.studentParticipation.submissions![0].submitted).toBeTrue();
        expect(component.studentParticipation.submissions![0].isSynced).toBeTrue();
    });

    it('should not be synced on file change', () => {
        component.studentParticipation = newParticipation();

        component.studentParticipation.submissions![0].isSynced = true;
        component.onFileChanged();

        expect(component.studentParticipation.submissions![0].isSynced).toBeFalse();
    });

    it('should get submission', () => {
        const participation = newParticipation();
        component.studentParticipation = participation;

        expect(component.getSubmission()).toEqual(participation.submissions![0]);
    });

    it('should return false if no unsaved changes', () => {
        const exercise = newExercise();

        exercise.allowOfflineIde = true;
        exercise.allowOnlineEditor = false;
        component.exercise = exercise;

        expect(component.hasUnsavedChanges()).toBeFalse();
    });
});
