import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/angular';
import { JhiMainComponent } from 'app/shared/layouts/main/main.component';
import { AlertOverlayComponent } from 'app/shared/alert/alert-overlay.component';
import { PageRibbonComponent } from 'app/shared/layouts/profiles/page-ribbon.component';
import { NotificationPopupComponent } from 'app/shared/notification/notification-popup/notification-popup.component';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { ThemeService } from 'app/core/theme/theme.service';
import { ArtemisTranslatePipe } from '../../../main/webapp/app/shared/pipes/artemis-translate.pipe';
import { MockSyncStorage } from '../spec/helpers/mocks/service/mock-sync-storage.service';
import { MockTranslateService } from '../spec/helpers/mocks/service/mock-translate.service';
import { ArtemisTestModule } from '../spec/test.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Mock the initialize method
class MockThemeService {
    // Required because the real ThemeService uses this method, even though it's not called in the tests
    initialize(): void {}
}

describe('JhiMainComponent', () => {
    let component: JhiMainComponent;
    let componentFixture: ComponentFixture<JhiMainComponent>;
    let container: Element;

    beforeEach(async () => {
        const { fixture, container: renderedContainer } = await render(JhiMainComponent, {
            imports: [ArtemisTestModule],
            declarations: [AlertOverlayComponent, PageRibbonComponent, NotificationPopupComponent],
            providers: [
                { provide: LocalStorageService, useClass: MockSyncStorage },
                { provide: SessionStorageService, useClass: MockSyncStorage },
                { provide: TranslateService, useClass: MockTranslateService },
                { provide: ThemeService, useClass: MockThemeService },
                ArtemisTranslatePipe,
            ],
        });

        componentFixture = fixture;
        component = fixture.componentInstance;
        container = renderedContainer; // Save the container for querying elements
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should use the initialize method of ThemeService', () => {
        const themeService = TestBed.inject(ThemeService) as MockThemeService;
        themeService.initialize();
    });

    it('should display footer if there is no exam', async () => {
        component.isExamStarted = false;
        component.showSkeleton = true;

        const footerElement = container.querySelector('jhi-footer');
        const notificationPopup = container.querySelector('jhi-notification-popup');

        expect(footerElement).not.toBeNull();
        expect(notificationPopup).not.toBeNull();
    });

    it('should not display footer during an exam', async () => {
        component.isExamStarted = true;
        component.showSkeleton = true;
        component.isTestRunExam = false;
        component.isShownViaLti = false;

        componentFixture.detectChanges(); // Trigger change detection

        const notificationPopup = container.querySelector('jhi-notification-popup');
        const footerElement = container.querySelector('jhi-footer');

        expect(notificationPopup).not.toBeNull();
        expect(footerElement).toBeNull();
    });
});
