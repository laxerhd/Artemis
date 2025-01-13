import { Component, Input } from '@angular/core';
import { Exercise, ExerciseType } from 'app/entities/exercise.model';
import { ModelingExercise } from 'app/entities/modeling-exercise.model';
import { ArtemisTranslatePipe } from 'app/shared/pipes/artemis-translate.pipe';

@Component({
    selector: 'jhi-modeling-exercise-group-cell',
    templateUrl: './modeling-exercise-group-cell.component.html',
    styles: [':host{display: contents}'],
    imports: [ArtemisTranslatePipe],
})
export class ModelingExerciseGroupCellComponent {
    exerciseType = ExerciseType;
    modelingExercise: ModelingExercise;

    @Input()
    set exercise(exercise: Exercise) {
        this.modelingExercise = exercise as ModelingExercise;
    }
}
