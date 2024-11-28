package de.tum.cit.aet.artemis.programming.domain;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

/**
 * Enumeration for supported static code analysis tools
 */
public enum StaticCodeAnalysisTool {

    // @formatter:off
    SPOTBUGS("spotbugsXml.xml"),
    CHECKSTYLE("checkstyle-result.xml"),
    PMD("pmd.xml"),
    PMD_CPD("cpd.xml"),
    SWIFTLINT("swiftlint-result.xml"),
    GCC("gcc.xml"),
    OTHER(null),
    ;
    // @formatter:on

    // @formatter:off
    private static final Map<ProgrammingLanguage, List<StaticCodeAnalysisTool>> TOOLS_OF_PROGRAMMING_LANGUAGE = new EnumMap<>(Map.of(
        ProgrammingLanguage.JAVA, List.of(SPOTBUGS, CHECKSTYLE, PMD, PMD_CPD),
        ProgrammingLanguage.SWIFT, List.of(SWIFTLINT),
        ProgrammingLanguage.C, List.of(GCC)
    ));
    // @formatter:on

    private final String fileName;

    StaticCodeAnalysisTool(String fileName) {
        this.fileName = fileName;
    }

    /**
     * Returns all static code analysis tools supporting the given programming language.
     *
     * @param language Programming language for which the static code analysis tools should be returned
     * @return List of static code analysis
     */
    public static List<StaticCodeAnalysisTool> getToolsForProgrammingLanguage(ProgrammingLanguage language) {
        return TOOLS_OF_PROGRAMMING_LANGUAGE.getOrDefault(language, List.of());
    }

    /**
     * Finds a tool by its file pattern (the xml file generated by the tool).
     *
     * @param fileName the name of the xml file generated by the tool
     * @return Optional with the corresponding tool or empty optional if no appropriate tool was found
     */
    public static Optional<StaticCodeAnalysisTool> getToolByFilePattern(String fileName) {
        for (StaticCodeAnalysisTool tool : StaticCodeAnalysisTool.values()) {
            if (Objects.equals(fileName, tool.fileName)) {
                return Optional.of(tool);
            }
        }
        return Optional.empty();
    }

}
