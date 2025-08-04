package com.demo.project.repository;

import com.demo.project.entity.TeacherDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeacherDocumentRepository extends JpaRepository<TeacherDocument, Long> {
    // Spring Data JPA automatically creates the query from the method name!
    List<TeacherDocument> findByAishaCode(String aishaCode);
}