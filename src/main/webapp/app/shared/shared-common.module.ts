import { NgModule } from '@angular/core';
import { FindLanguageFromKeyPipe } from 'app/shared/language/find-language-from-key.pipe';
import { AlertOverlayComponent } from 'app/shared/alert/alert-overlay.component';
import { TranslateDirective } from 'app/shared/language/translate.directive';
import { SortByDirective } from 'app/shared/sort/sort-by.directive';
import { SortDirective } from 'app/shared/sort/sort.directive';
import { ArtemisDatePipe } from 'app/shared/pipes/artemis-date.pipe';
import { ArtemisDurationFromSecondsPipe } from 'app/shared/pipes/artemis-duration-from-seconds.pipe';
import { ArtemisTranslatePipe } from 'app/shared/pipes/artemis-translate.pipe';
import { ArtemisTimeAgoPipe } from 'app/shared/pipes/artemis-time-ago.pipe';
import { DurationPipe } from 'app/shared/pipes/duration.pipe';
import { CloseCircleComponent } from 'app/shared/close-circle/close-circle.component';
import { ArtemisDateRangePipe } from 'app/shared/pipes/artemis-date-range.pipe';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbHighlight, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        TranslateDirective,
        ArtemisTranslatePipe,
        ArtemisDatePipe,
        ArtemisDateRangePipe,
        FindLanguageFromKeyPipe,
        AlertOverlayComponent,
        SortByDirective,
        SortDirective,
        ArtemisTimeAgoPipe,
        ArtemisDurationFromSecondsPipe,
        DurationPipe,
        CloseCircleComponent,
        FaIconComponent,
        CommonModule,
        NgbTooltipModule,
        FormsModule,
        NgbHighlight,
    ],
    exports: [
        ArtemisDatePipe,
        ArtemisDateRangePipe,
        FindLanguageFromKeyPipe,
        AlertOverlayComponent,
        TranslateDirective,
        SortByDirective,
        SortDirective,
        ArtemisTranslatePipe,
        ArtemisTimeAgoPipe,
        ArtemisDurationFromSecondsPipe,
        DurationPipe,
        CloseCircleComponent,
        FaIconComponent,
        CommonModule,
        NgbTooltipModule,
        FormsModule,
        NgbHighlight,
    ],
    providers: [ArtemisDatePipe, ArtemisDateRangePipe],
})
export class ArtemisSharedCommonModule {}
