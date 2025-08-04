package com.demo.project.repository;

import com.demo.project.entity.CollegeTeacherInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollegeTeacherInfoRepository extends JpaRepository<CollegeTeacherInfo, Long> {
}
