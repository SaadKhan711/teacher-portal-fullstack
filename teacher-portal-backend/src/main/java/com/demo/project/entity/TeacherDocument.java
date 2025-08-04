package com.demo.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
@Entity
@Table(name = "teacher_document")
public class TeacherDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "college_teacher_id")
    private Long collegeTeacherId;

    @Column(name = "standalone_teacher_id")
    private Long standaloneTeacherId;

    @Column(name = "university_teacher_id")
    private Long universityTeacherId;

   
    @Column(name = "teacher_highest_qualification")
    private byte[] teacherHighestQualification;

    @Column(name = "aisha")
    private String aishaCode; 

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCollegeTeacherId() {
        return collegeTeacherId;
    }

    public void setCollegeTeacherId(Long collegeTeacherId) {
        this.collegeTeacherId = collegeTeacherId;
    }

    public Long getStandaloneTeacherId() {
        return standaloneTeacherId;
    }

    public void setStandaloneTeacherId(Long standaloneTeacherId) {
        this.standaloneTeacherId = standaloneTeacherId;
    }

    public Long getUniversityTeacherId() {
        return universityTeacherId;
    }

    public void setUniversityTeacherId(Long universityTeacherId) {
        this.universityTeacherId = universityTeacherId;
    }

    public byte[] getTeacherHighestQualification() {
        return teacherHighestQualification;
    }

    public void setTeacherHighestQualification(byte[] teacherHighestQualification) {
        this.teacherHighestQualification = teacherHighestQualification;
    }

    public String getAishaCode() {
        return aishaCode;
    }

    public void setAishaCode(String aishaCode) {
        this.aishaCode = aishaCode;
    }
}

