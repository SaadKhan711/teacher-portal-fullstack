package com.demo.project.repository;

import com.demo.project.entity.StandaloneTeacherInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StandaloneTeacherInfoRepository extends JpaRepository<StandaloneTeacherInfo, Long> {
}
