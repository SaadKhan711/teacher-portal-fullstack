package com.demo.project.repository;

import com.demo.project.entity.UniversityTeacherInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityTeacherInfoRepository extends JpaRepository<UniversityTeacherInfo, Long> {
}