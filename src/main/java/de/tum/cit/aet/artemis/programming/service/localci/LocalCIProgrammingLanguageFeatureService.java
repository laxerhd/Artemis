package de.tum.cit.aet.artemis.programming.service.localci;

import static de.tum.cit.aet.artemis.core.config.Constants.PROFILE_LOCALCI;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.ASSEMBLER;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.C;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.C_PLUS_PLUS;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.C_SHARP;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.EMPTY;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.GO;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.HASKELL;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.JAVA;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.JAVASCRIPT;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.KOTLIN;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.OCAML;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.PYTHON;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.R;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.RUST;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.SWIFT;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.TYPESCRIPT;
import static de.tum.cit.aet.artemis.programming.domain.ProgrammingLanguage.VHDL;
import static de.tum.cit.aet.artemis.programming.domain.ProjectType.FACT;
import static de.tum.cit.aet.artemis.programming.domain.ProjectType.GCC;
import static de.tum.cit.aet.artemis.programming.domain.ProjectType.GRADLE_GRADLE;
import static de.tum.cit.aet.artemis.programming.domain.ProjectType.MAVEN_MAVEN;
import static de.tum.cit.aet.artemis.programming.domain.ProjectType.PLAIN;
import static de.tum.cit.aet.artemis.programming.domain.ProjectType.PLAIN_GRADLE;
import static de.tum.cit.aet.artemis.programming.domain.ProjectType.PLAIN_MAVEN;

import java.util.List;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import de.tum.cit.aet.artemis.programming.service.ProgrammingLanguageFeature;
import de.tum.cit.aet.artemis.programming.service.ProgrammingLanguageFeatureService;

/**
 * Sets the features provided for the different programming languages when using the local CI system.
 */
@Service
@Profile(PROFILE_LOCALCI)
public class LocalCIProgrammingLanguageFeatureService extends ProgrammingLanguageFeatureService {

    public LocalCIProgrammingLanguageFeatureService() {
        // Must be extended once a new programming language is added
        programmingLanguageFeatures.put(EMPTY, new ProgrammingLanguageFeature(EMPTY, false, false, false, false, false, List.of(), false));
        programmingLanguageFeatures.put(ASSEMBLER, new ProgrammingLanguageFeature(ASSEMBLER, false, false, false, false, false, List.of(), false));
        programmingLanguageFeatures.put(C, new ProgrammingLanguageFeature(C, false, true, true, false, false, List.of(FACT, GCC), false));
        programmingLanguageFeatures.put(C_PLUS_PLUS, new ProgrammingLanguageFeature(C_PLUS_PLUS, false, false, true, false, false, List.of(), false));
        programmingLanguageFeatures.put(C_SHARP, new ProgrammingLanguageFeature(C_SHARP, false, false, true, false, false, List.of(), false));
        programmingLanguageFeatures.put(GO, new ProgrammingLanguageFeature(GO, false, false, true, true, false, List.of(), false));
        programmingLanguageFeatures.put(HASKELL, new ProgrammingLanguageFeature(HASKELL, true, false, false, false, true, List.of(), false));
        programmingLanguageFeatures.put(JAVA,
                new ProgrammingLanguageFeature(JAVA, true, true, true, true, false, List.of(PLAIN_GRADLE, GRADLE_GRADLE, PLAIN_MAVEN, MAVEN_MAVEN), false));
        programmingLanguageFeatures.put(JAVASCRIPT, new ProgrammingLanguageFeature(JAVASCRIPT, false, false, true, false, false, List.of(), false));
        programmingLanguageFeatures.put(KOTLIN, new ProgrammingLanguageFeature(KOTLIN, false, false, true, true, false, List.of(), false));
        programmingLanguageFeatures.put(OCAML, new ProgrammingLanguageFeature(OCAML, false, false, false, false, true, List.of(), false));
        programmingLanguageFeatures.put(PYTHON, new ProgrammingLanguageFeature(PYTHON, false, false, true, false, false, List.of(), false));
        programmingLanguageFeatures.put(R, new ProgrammingLanguageFeature(R, false, false, true, false, false, List.of(), false));
        programmingLanguageFeatures.put(RUST, new ProgrammingLanguageFeature(RUST, false, false, true, false, false, List.of(), false));
        programmingLanguageFeatures.put(SWIFT, new ProgrammingLanguageFeature(SWIFT, false, false, true, true, false, List.of(PLAIN), false));
        programmingLanguageFeatures.put(TYPESCRIPT, new ProgrammingLanguageFeature(TYPESCRIPT, false, false, true, false, false, List.of(), false));
        programmingLanguageFeatures.put(VHDL, new ProgrammingLanguageFeature(VHDL, false, false, false, false, false, List.of(), false));
    }
}
