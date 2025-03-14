import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ProgrammingExercise, ProgrammingLanguage } from 'app/entities/programming/programming-exercise.model';
import { FeatureToggle } from 'app/shared/feature-toggle/feature-toggle.service';
import { ExternalCloningService } from 'app/exercises/programming/shared/service/external-cloning.service';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'app/core/auth/account.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { User } from 'app/core/user/user.model';
import { ProfileService } from 'app/shared/layouts/profiles/profile.service';
import { LocalStorageService } from 'ngx-webstorage';
import { ProgrammingExerciseStudentParticipation } from 'app/entities/participation/programming-exercise-student-participation.model';
import { ParticipationService } from 'app/exercises/shared/participation/participation.service';
import { PROFILE_GITLAB, PROFILE_LOCALVC } from 'app/app.constants';
import dayjs from 'dayjs/esm';
import { isPracticeMode } from 'app/entities/participation/student-participation.model';
import { faCode, faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { IdeSettingsService } from 'app/shared/user-settings/ide-preferences/ide-settings.service';
import { Ide } from 'app/shared/user-settings/ide-preferences/ide.model';
import { SshUserSettingsService } from 'app/shared/user-settings/ssh-settings/ssh-user-settings.service';
import { UserSshPublicKey } from 'app/entities/programming/user-ssh-public-key.model';

@Component({
    selector: 'jhi-code-button',
    templateUrl: './code-button.component.html',
    styleUrls: ['./code-button.component.scss'],
})
export class CodeButtonComponent implements OnInit, OnChanges {
    readonly FeatureToggle = FeatureToggle;
    readonly ProgrammingLanguage = ProgrammingLanguage;

    @Input() loading = false;
    @Input() useParticipationVcsAccessToken = false;
    @Input() smallButtons: boolean;
    @Input() repositoryUri?: string;
    @Input() routerLinkForRepositoryView?: string | (string | number)[];
    @Input() participations?: ProgrammingExerciseStudentParticipation[];
    @Input() exercise?: ProgrammingExercise;
    @Input() hideLabelMobile = false;

    useSsh = false;
    useToken = false;
    tokenExpired = false;
    tokenMissing = false;
    sshEnabled = false;
    sshTemplateUrl?: string;
    sshSettingsUrl?: string;
    vcsTokenSettingsUrl?: string;
    repositoryPassword?: string;
    versionControlUrl: string;
    accessTokensEnabled?: boolean;
    localVCEnabled = false;
    gitlabVCEnabled = false;
    showCloneUrlWithoutToken = true;
    copyEnabled? = true;
    doesUserHaveSSHkeys = false;
    areAnySshKeysExpired = false;

    sshKeyMissingTip: string;
    sshKeysExpiredTip: string;
    tokenMissingTip: string;
    tokenExpiredTip: string;

    user: User;
    sshKeys?: UserSshPublicKey[];
    cloneHeadline: string;
    wasCopied = false;
    isTeamParticipation: boolean;
    activeParticipation?: ProgrammingExerciseStudentParticipation;
    isPracticeMode: boolean | undefined;

    vscodeFallback: Ide = { name: 'VS Code', deepLink: 'vscode://vscode.git/clone?url={cloneUrl}' };
    programmingLanguageToIde: Map<ProgrammingLanguage, Ide> = new Map([[ProgrammingLanguage.EMPTY, this.vscodeFallback]]);

    // Icons
    readonly faCode = faCode;
    readonly faExternalLink = faExternalLink;
    ideName: string;

    constructor(
        private translateService: TranslateService,
        private externalCloningService: ExternalCloningService,
        private sshUserSettingsService: SshUserSettingsService,
        private accountService: AccountService,
        private profileService: ProfileService,
        private localStorage: LocalStorageService,
        private participationService: ParticipationService,
        private ideSettingsService: IdeSettingsService,
    ) {}

    async ngOnInit() {
        const user = await this.accountService.identity();
        if (!user) {
            return;
        }
        this.user = user;

        await this.checkForSshKeys();
        this.refreshTokenState();

        this.copyEnabled = true;
        this.useSsh = this.localStorage.retrieve('useSsh') || false;
        this.useToken = this.localStorage.retrieve('useToken') || false;

        // Get ssh information from the user
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            this.sshSettingsUrl = profileInfo.sshKeysURL;
            this.sshTemplateUrl = profileInfo.sshCloneURLTemplate;

            this.sshEnabled = !!this.sshTemplateUrl;
            if (profileInfo.versionControlUrl) {
                this.versionControlUrl = profileInfo.versionControlUrl;
            }
            this.accessTokensEnabled = profileInfo.useVersionControlAccessToken ?? false;
            this.showCloneUrlWithoutToken = profileInfo.showCloneUrlWithoutToken ?? true;
            this.useToken = !this.showCloneUrlWithoutToken;
            this.localVCEnabled = profileInfo.activeProfiles.includes(PROFILE_LOCALVC);
            this.gitlabVCEnabled = profileInfo.activeProfiles.includes(PROFILE_GITLAB);
            if (this.localVCEnabled) {
                this.sshSettingsUrl = `${window.location.origin}/user-settings/ssh`;
                this.vcsTokenSettingsUrl = `${window.location.origin}/user-settings/vcs-token`;
                this.tokenMissingTip = this.formatTip('artemisApp.exerciseActions.vcsTokenTip', this.vcsTokenSettingsUrl);
                this.tokenExpiredTip = this.formatTip('artemisApp.exerciseActions.vcsTokenExpiredTip', this.vcsTokenSettingsUrl);
            } else {
                this.sshSettingsUrl = profileInfo.sshKeysURL;
            }
            this.sshKeyMissingTip = this.formatTip('artemisApp.exerciseActions.sshKeyTip', this.sshSettingsUrl);
            this.sshKeysExpiredTip = this.formatTip('artemisApp.exerciseActions.sshKeyExpiredTip', this.sshSettingsUrl);

            if (this.useSsh) {
                this.useSshUrl();
            }
            if (this.useToken) {
                this.useHttpsUrlWithToken();
            }
            this.loadParticipationVcsAccessTokens();
        });

        this.ideSettingsService.loadIdePreferences().then((programmingLanguageToIde) => {
            if (programmingLanguageToIde.size) {
                this.programmingLanguageToIde = programmingLanguageToIde;
            }

            this.ideName = this.getIde().name;
        });
    }

    ngOnChanges() {
        if (this.participations?.length) {
            const shouldPreferPractice = this.participationService.shouldPreferPractice(this.exercise);
            this.activeParticipation = this.participationService.getSpecificStudentParticipation(this.participations, shouldPreferPractice) ?? this.participations[0];
            this.isPracticeMode = isPracticeMode(this.activeParticipation);
            this.cloneHeadline =
                this.isPracticeMode && !this.exercise?.exerciseGroup ? 'artemisApp.exerciseActions.clonePracticeRepository' : 'artemisApp.exerciseActions.cloneRatedRepository';
            this.isTeamParticipation = !!this.activeParticipation?.team;
        } else if (this.repositoryUri) {
            this.cloneHeadline = 'artemisApp.exerciseActions.cloneExerciseRepository';
        }
        this.loadParticipationVcsAccessTokens();
    }

    public useSshUrl() {
        this.useSsh = true;
        this.useToken = false;
        this.copyEnabled = this.doesUserHaveSSHkeys || this.gitlabVCEnabled;
        this.storeToLocalStorage();
    }

    public useHttpsUrlWithToken() {
        this.useSsh = false;
        this.useToken = true;
        this.copyEnabled = !!(this.accessTokensEnabled && ((!!this.user.vcsAccessToken && !this.isTokenExpired()) || this.useParticipationVcsAccessToken));
        this.refreshTokenState();
        this.storeToLocalStorage();
    }

    public useHttpsUrlWithoutToken() {
        this.useSsh = false;
        this.useToken = false;
        this.copyEnabled = true;
        this.storeToLocalStorage();
    }

    public storeToLocalStorage() {
        this.localStorage.store('useSsh', this.useSsh);
        this.localStorage.store('useToken', this.useToken);
    }

    public refreshTokenState() {
        this.tokenMissing = !this.user.vcsAccessToken;
        this.tokenExpired = this.isTokenExpired();
    }

    public formatTip(translationKey: string, url: string): string {
        return this.translateService.instant(translationKey).replace(/{link:(.*)}/, `<a href="${url}" target="_blank">$1</a>`);
    }

    public isTokenExpired(): boolean {
        return dayjs().isAfter(dayjs(this.user.vcsAccessTokenExpiryDate));
    }

    private getRepositoryUri() {
        return this.activeParticipation?.repositoryUri ?? this.repositoryUri!;
    }

    getHttpOrSshRepositoryUri(insertPlaceholder = true): string {
        if (this.useSsh && this.sshEnabled && this.sshTemplateUrl) {
            return this.getSshCloneUrl(this.getRepositoryUri()) || this.getRepositoryUri();
        }
        if (this.isTeamParticipation) {
            return this.addCredentialsToHttpUrl(this.repositoryUriForTeam(this.getRepositoryUri()), insertPlaceholder);
        }
        return this.addCredentialsToHttpUrl(this.getRepositoryUri(), insertPlaceholder);
    }

    loadParticipationVcsAccessTokens() {
        if (this.accessTokensEnabled && this.localVCEnabled && this.useParticipationVcsAccessToken) {
            this.participations?.forEach((participation) => {
                if (participation?.id && !participation.vcsAccessToken) {
                    this.loadVcsAccessToken(participation);
                }
            });
            if (this.activeParticipation?.vcsAccessToken) {
                this.user.vcsAccessToken = this.activeParticipation?.vcsAccessToken;
            }
        }
    }

    /**
     * Loads the vcsAccessToken for a participation from the server. If none exists, sens a request to create one
     */
    loadVcsAccessToken(participation: ProgrammingExerciseStudentParticipation) {
        this.accountService.getVcsAccessToken(participation!.id!).subscribe({
            next: (res: HttpResponse<string>) => {
                if (res.body) {
                    participation.vcsAccessToken = res.body;
                    if (this.activeParticipation?.id == participation.id) {
                        this.user.vcsAccessToken = res.body;
                    }
                }
            },
            error: (error: HttpErrorResponse) => {
                if (error.status == 404) {
                    this.createNewVcsAccessToken(participation);
                }
                if (error.status == 403) {
                    this.useParticipationVcsAccessToken = false;
                }
            },
        });
    }

    /**
     * Sends the request to create a new
     */
    createNewVcsAccessToken(participation: ProgrammingExerciseStudentParticipation) {
        this.accountService.createVcsAccessToken(participation!.id!).subscribe({
            next: (res: HttpResponse<string>) => {
                if (res.body) {
                    participation.vcsAccessToken = res.body;
                    if (this.activeParticipation?.id == participation.id) {
                        this.user.vcsAccessToken = res.body;
                    }
                }
            },
            error: (error: HttpErrorResponse) => {
                if (error.status == 403) {
                    this.useParticipationVcsAccessToken = false;
                }
            },
        });
    }

    /**
     * Add the credentials to the http url, if possible.
     * The token will be added if
     * - the token is required (based on the profile information), and
     * - the token is present (based on the user model).
     *
     * @param url the url to which the credentials should be added
     * @param insertPlaceholder if true, instead of the actual token, '**********' is used (e.g. to prevent leaking the token during a screen-share)
     */
    private addCredentialsToHttpUrl(url: string, insertPlaceholder = false): string {
        const includeToken = this.accessTokensEnabled && this.user.vcsAccessToken && this.useToken;
        const token = insertPlaceholder ? '**********' : this.user.vcsAccessToken;
        const credentials = `://${this.user.login}${includeToken ? `:${token}` : ''}@`;
        if (!url.includes('@')) {
            // the url has the format https://vcs-server.com
            return url.replace('://', credentials);
        } else {
            // the url has the format https://username@vcs-server.com -> replace ://username@
            return url.replace(/:\/\/.*@/, credentials);
        }
    }

    /**
     * Gets the external link of the repository. For LocalVC, undefined is returned.
     */
    getHttpRepositoryUri(): string {
        return this.isTeamParticipation ? this.repositoryUriForTeam(this.getRepositoryUri()) : this.getRepositoryUri();
    }

    /**
     * The user info part of the repository uri of a team participation has to be added with the current user's login.
     *
     * @return repository uri with username of current user inserted
     */
    private repositoryUriForTeam(url: string) {
        // (https://)(gitlab.ase.in.tum.de/...-team1.git)  =>  (https://)ga12abc@(gitlab.ase.in.tum.de/...-team1.git)
        return url.replace(/^(\w*:\/\/)(.*)$/, `$1${this.user.login}@$2`);
    }

    /**
     * Transforms the repository uri to an ssh clone url
     */
    private getSshCloneUrl(url?: string) {
        return url?.replace(/^\w*:\/\/[^/]*?\/(scm\/)?(.*)$/, this.sshTemplateUrl + '$2');
    }

    /**
     * set wasCopied for 3 seconds on success
     */
    onCopyFinished(successful: boolean) {
        if (successful) {
            this.wasCopied = true;
            setTimeout(() => {
                this.wasCopied = false;
            }, 3000);
        }
    }

    /**
     * build the sourceTreeUrl from the repository uri
     * @return sourceTreeUrl
     */
    buildSourceTreeUrl(): string | undefined {
        return this.externalCloningService.buildSourceTreeUrl(this.versionControlUrl, this.getHttpOrSshRepositoryUri(false));
    }

    buildIdeUrl(): string | undefined {
        return this.externalCloningService.buildIdeUrl(this.getHttpOrSshRepositoryUri(false), this.getIde());
    }

    getIde(): Ide {
        return (
            this.programmingLanguageToIde.get(this.exercise?.programmingLanguage ?? ProgrammingLanguage.EMPTY) ??
            this.programmingLanguageToIde.get(ProgrammingLanguage.EMPTY) ??
            this.vscodeFallback
        );
    }

    switchPracticeMode() {
        this.isPracticeMode = !this.isPracticeMode;
        this.activeParticipation = this.participationService.getSpecificStudentParticipation(this.participations!, this.isPracticeMode)!;
        this.cloneHeadline = this.isPracticeMode ? 'artemisApp.exerciseActions.clonePracticeRepository' : 'artemisApp.exerciseActions.cloneRatedRepository';
        if (this.activeParticipation.vcsAccessToken) {
            this.user.vcsAccessToken = this.activeParticipation.vcsAccessToken;
        }
    }

    /**
     * Checks whether the user owns any SSH keys, and checks if any of them is expired
     */
    private async checkForSshKeys() {
        this.sshKeys = await this.sshUserSettingsService.getCachedSshKeys();
        if (this.sshKeys) {
            const now = dayjs();
            this.doesUserHaveSSHkeys = this.sshKeys.length > 0;
            this.areAnySshKeysExpired = this.sshKeys.some((key) => {
                if (key.expiryDate) {
                    return dayjs(key.expiryDate).isBefore(now);
                }
            });
        }
    }
}
