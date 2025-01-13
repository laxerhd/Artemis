import { NgModule } from '@angular/core';
import { MultipleChoiceQuestionEditComponent } from 'app/exercises/quiz/manage/multiple-choice-question/multiple-choice-question-edit.component';
import { DragAndDropQuestionEditComponent } from 'app/exercises/quiz/manage/drag-and-drop-question/drag-and-drop-question-edit.component';
import { ShortAnswerQuestionEditComponent } from 'app/exercises/quiz/manage/short-answer-question/short-answer-question-edit.component';
import { ArtemisMarkdownEditorModule } from 'app/shared/markdown-editor/markdown-editor.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuizScoringInfoModalComponent } from './quiz-scoring-info-modal/quiz-scoring-info-modal.component';
import { ArtemisSharedModule } from 'app/shared/shared.module';
import { ArtemisQuizStatisticModule } from 'app/exercises/quiz/manage/statistics/quiz-statistic.module';
import { ArtemisApollonDiagramsModule } from 'app/exercises/quiz/manage/apollon-diagrams/apollon-diagram.module';
import { quizManagementRoute } from 'app/exercises/quiz/manage/quiz-management.route';
import { QuizExerciseComponent } from 'app/exercises/quiz/manage/quiz-exercise.component';
import { QuizExerciseUpdateComponent } from 'app/exercises/quiz/manage/quiz-exercise-update.component';
import { RouterModule } from '@angular/router';
import { FormDateTimePickerModule } from 'app/shared/date-time-picker/date-time-picker.module';
import { ArtemisCategorySelectorModule } from 'app/shared/category-selector/category-selector.module';
import { ArtemisDifficultyPickerModule } from 'app/exercises/shared/difficulty-picker/difficulty-picker.module';
import { QuizReEvaluateComponent } from 'app/exercises/quiz/manage/re-evaluate/quiz-re-evaluate.component';
import { ReEvaluateMultipleChoiceQuestionComponent } from 'app/exercises/quiz/manage/re-evaluate/multiple-choice-question/re-evaluate-multiple-choice-question.component';
import { ReEvaluateDragAndDropQuestionComponent } from 'app/exercises/quiz/manage/re-evaluate/drag-and-drop-question/re-evaluate-drag-and-drop-question.component';
import { ReEvaluateShortAnswerQuestionComponent } from 'app/exercises/quiz/manage/re-evaluate/short-answer-question/re-evaluate-short-answer-question.component';
import { QuizReEvaluateWarningComponent } from 'app/exercises/quiz/manage/re-evaluate/quiz-re-evaluate-warning.component';
import { QuizExerciseExportComponent } from 'app/exercises/quiz/manage/quiz-exercise-export.component';
import { ArtemisQuizQuestionTypesModule } from 'app/exercises/quiz/shared/questions/artemis-quiz-question-types.module';
import { ArtemisQuizParticipationModule } from 'app/exercises/quiz/participate/quiz-participation.module';
import { QuizConfirmImportInvalidQuestionsModalComponent } from 'app/exercises/quiz/manage/quiz-confirm-import-invalid-questions-modal.component';
import { ArtemisIncludedInOverallScorePickerModule } from 'app/exercises/shared/included-in-overall-score-picker/included-in-overall-score-picker.module';
import { MatchPercentageInfoModalComponent } from 'app/exercises/quiz/manage/match-percentage-info-modal/match-percentage-info-modal.component';
import { ArtemisMarkdownModule } from 'app/shared/markdown.module';

import { ArtemisSharedComponentModule } from 'app/shared/components/shared-component.module';
import { ExerciseCategoriesModule } from 'app/shared/exercise-categories/exercise-categories.module';
import { QuizPoolMappingComponent } from 'app/exercises/quiz/manage/quiz-pool-mapping.component';
import { QuizPoolMappingQuestionListComponent } from 'app/exercises/quiz/manage/quiz-pool-mapping-question-list.component';
import { QuizPoolComponent } from 'app/exercises/quiz/manage/quiz-pool.component';
import { QuizExerciseCreateButtonsComponent } from 'app/exercises/quiz/manage/quiz-exercise-create-buttons.component';
import { QuizQuestionListEditComponent } from 'app/exercises/quiz/manage/quiz-question-list-edit.component';
import { QuizQuestionListEditExistingComponent } from 'app/exercises/quiz/manage/quiz-question-list-edit-existing.component';
import { ExerciseTitleChannelNameModule } from 'app/exercises/shared/exercise-title-channel-name/exercise-title-channel-name.module';
import { QuizExerciseDetailComponent } from 'app/exercises/quiz/manage/quiz-exercise-detail.component';
import { DetailModule } from 'app/detail-overview-list/detail.module';
import { QuizExerciseManageButtonsComponent } from 'app/exercises/quiz/manage/quiz-exercise-manage-buttons.component';
import { ArtemisExerciseModule } from 'app/exercises/shared/exercise/exercise.module';

const ENTITY_STATES = [...quizManagementRoute];

@NgModule({
    imports: [
        ArtemisSharedModule,
        RouterModule.forChild(ENTITY_STATES),
        DragDropModule,
        FormDateTimePickerModule,
        ArtemisQuizQuestionTypesModule,
        ArtemisMarkdownEditorModule,
        ArtemisQuizStatisticModule,
        ArtemisApollonDiagramsModule,
        ArtemisCategorySelectorModule,
        ArtemisDifficultyPickerModule,
        ArtemisIncludedInOverallScorePickerModule,
        ArtemisQuizParticipationModule,
        ArtemisMarkdownModule,
        ArtemisSharedComponentModule,
        ExerciseCategoriesModule,
        ExerciseTitleChannelNameModule,
        DetailModule,
        ArtemisExerciseModule,
        QuizExerciseManageButtonsComponent,
        QuizExerciseComponent,
        QuizExerciseCreateButtonsComponent,
        QuizConfirmImportInvalidQuestionsModalComponent,
        QuizExerciseUpdateComponent,
        QuizExerciseDetailComponent,
        MultipleChoiceQuestionEditComponent,
        DragAndDropQuestionEditComponent,
        QuizScoringInfoModalComponent,
        ShortAnswerQuestionEditComponent,
        QuizReEvaluateComponent,
        ReEvaluateMultipleChoiceQuestionComponent,
        ReEvaluateDragAndDropQuestionComponent,
        ReEvaluateShortAnswerQuestionComponent,
        QuizReEvaluateWarningComponent,
        QuizExerciseExportComponent,
        MatchPercentageInfoModalComponent,
        QuizPoolMappingComponent,
        QuizPoolMappingQuestionListComponent,
        QuizPoolComponent,
        QuizQuestionListEditComponent,
        QuizQuestionListEditExistingComponent,
    ],
    exports: [QuizExerciseComponent, QuizExerciseCreateButtonsComponent],
})
export class ArtemisQuizManagementModule {}
