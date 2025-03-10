package de.tum.cit.aet.artemis.programming.domain;

import static de.tum.cit.aet.artemis.programming.domain.ProgrammingExerciseTestCaseType.DEFAULT;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import de.tum.cit.aet.artemis.assessment.domain.FeedbackType;
import de.tum.cit.aet.artemis.assessment.domain.Result;
import de.tum.cit.aet.artemis.assessment.domain.Visibility;
import de.tum.cit.aet.artemis.core.domain.DomainObject;
import de.tum.cit.aet.artemis.exercise.domain.Exercise;

/**
 * A ProgrammingExerciseTestCase.
 */
@Entity
@Table(name = "programming_exercise_test_case")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ProgrammingExerciseTestCase extends DomainObject {

    @Column(name = "test_name")
    private String testName;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "active", columnDefinition = "boolean DEFAULT false")
    private Boolean active = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "visibility")
    private Visibility visibility;

    @Column(name = "bonus_multiplier")
    private Double bonusMultiplier;

    @Column(name = "bonus_points")
    private Double bonusPoints;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "programming_exercise_task_test_case", joinColumns = @JoinColumn(name = "test_case_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "task_id", referencedColumnName = "id"))
    @JsonIgnoreProperties({ "testCases", "exercise" })
    private Set<ProgrammingExerciseTask> tasks = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties("testCases")
    private ProgrammingExercise exercise;

    @Enumerated(EnumType.STRING)
    @Column(name = "test_case_type", nullable = false)
    private ProgrammingExerciseTestCaseType type = DEFAULT;     // default value

    public ProgrammingExerciseTestCase id(Long id) {
        setId(id);
        return this;
    }

    public String getTestName() {
        return testName;
    }

    public ProgrammingExerciseTestCase testName(String testName) {
        this.testName = testName;
        return this;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public Double getWeight() {
        return weight;
    }

    public ProgrammingExerciseTestCase weight(Double weight) {
        this.weight = weight;
        return this;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    @NotNull
    public Double getBonusMultiplier() {
        return bonusMultiplier != null ? bonusMultiplier : 1.0;
    }

    public ProgrammingExerciseTestCase bonusMultiplier(Double bonusMultiplier) {
        this.bonusMultiplier = bonusMultiplier;
        return this;
    }

    public void setBonusMultiplier(Double bonusMultiplier) {
        this.bonusMultiplier = bonusMultiplier;
    }

    @NotNull
    public Double getBonusPoints() {
        return bonusPoints != null ? bonusPoints : 0.0;
    }

    public ProgrammingExerciseTestCase bonusPoints(Double bonusPoints) {
        this.bonusPoints = bonusPoints;
        return this;
    }

    public void setBonusPoints(Double bonusPoints) {
        this.bonusPoints = bonusPoints;
    }

    public Set<ProgrammingExerciseTask> getTasks() {
        return tasks;
    }

    public void setTasks(Set<ProgrammingExerciseTask> tasks) {
        this.tasks = tasks;
    }

    public Boolean isActive() {
        return active;
    }

    public ProgrammingExerciseTestCase active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public ProgrammingExerciseTestCase exercise(ProgrammingExercise exercise) {
        this.exercise = exercise;
        return this;
    }

    public void setExercise(ProgrammingExercise exercise) {
        this.exercise = exercise;
    }

    @JsonIgnore
    public boolean isAfterDueDate() {
        return visibility == Visibility.AFTER_DUE_DATE;
    }

    @JsonIgnore
    public boolean isInvisible() {
        return visibility == Visibility.NEVER;
    }

    public Visibility getVisibility() {
        return visibility;
    }

    public void setVisibility(Visibility visibility) {
        this.visibility = visibility;
    }

    public ProgrammingExerciseTestCase visibility(Visibility visibility) {
        this.visibility = visibility;
        return this;
    }

    public ProgrammingExerciseTestCaseType getType() {
        return type;
    }

    public void setType(ProgrammingExerciseTestCaseType programmingExerciseTestCaseType) {
        this.type = programmingExerciseTestCaseType;
    }

    /**
     * Needs to be checked and updated if there is a new class attribute. Creates a clone with all attributes set to the value of the object, including the id.
     *
     * @return a clone of the object.
     */
    @Override
    public ProgrammingExerciseTestCase clone() {
        ProgrammingExerciseTestCase clone = new ProgrammingExerciseTestCase().testName(this.getTestName()).weight(this.getWeight()).active(this.isActive())
                .bonusPoints(this.getBonusPoints()).bonusMultiplier(this.getBonusMultiplier()).visibility(visibility).exercise(this.exercise);
        clone.setId(this.getId());
        return clone;
    }

    /**
     * Checks for logical equality based on the name and the exercise
     *
     * @param testCase another test case which should be checked for being the same
     * @return whether this and the other test case are the same based on name and exercise
     */
    public boolean isSameTestCase(ProgrammingExerciseTestCase testCase) {
        return testCase.getTestName().equalsIgnoreCase(this.getTestName()) && this.getExercise().getId().equals(testCase.getExercise().getId());
    }

    @Override
    public String toString() {
        return "ProgrammingExerciseTestCase{" + "id=" + getId() + ", testName='" + testName + '\'' + ", weight=" + weight + ", active=" + active + ", visibility=" + visibility
                + ", bonusMultiplier=" + bonusMultiplier + ", bonusPoints=" + bonusPoints + ", type=" + type + '}';
    }

    /**
     * Check if the provided test was found in the result's feedbacks with positive = true.
     *
     * @param result of the build run.
     * @return true if there is a positive feedback for a given test.
     */
    public boolean isSuccessful(Result result) {
        return result.getFeedbacks().stream().anyMatch(feedback -> {
            boolean testsAreSame = this.equals(feedback.getTestCase());
            return testsAreSame && Boolean.TRUE.equals(feedback.isPositive());
        });
    }

    /**
     * Check if the provided test was not found in the result's feedbacks.
     *
     * @param result of the build run.
     * @return true if there is no feedback for a given test.
     */
    public boolean wasNotExecuted(Result result) {
        return result.getFeedbacks().stream().filter(feedback -> feedback.getType() == FeedbackType.AUTOMATIC).noneMatch(feedback -> this.equals(feedback.getTestCase()));
    }
}
