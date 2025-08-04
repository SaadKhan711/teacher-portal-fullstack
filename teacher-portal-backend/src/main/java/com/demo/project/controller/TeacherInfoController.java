package com.demo.project.controller;

import com.demo.project.entity.TeacherDocument;
import com.demo.project.service.TeacherInfoService;
import com.demo.project.vo.TeacherInfoVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/teacherinfo") // Base path for all endpoints in this controller
public class TeacherInfoController {

    @Autowired
    TeacherInfoService teacherService;

    @GetMapping
    // Anyone who is logged in (USER or ADMIN) can view the list
    public List<?> getAllteacherinfo(@RequestParam String type) {
        List<?> teacherinfo = teacherService.getAllteacherinfo(type);
        return teacherinfo;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMINS CAN ACCESS
    public Long saveTeacherInfo(@RequestBody TeacherInfoVo teacher) {
        Long issaveorfail = teacherService.saveTeacherInfo(teacher);
        return issaveorfail;
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMINS CAN ACCESS
    public boolean updateTeacherInfo(@RequestBody TeacherInfoVo teacher) {
        boolean isUpdated = teacherService.updateTeacherInfo(teacher);
        return isUpdated;
    }

    @DeleteMapping("/{type}/{id}")
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMINS CAN ACCESS
    public ResponseEntity<Void> deleteTeacherInfo(@PathVariable String type, @PathVariable Long id) {
        boolean isDeleted = teacherService.deleteTeacherInfo(type, id);
        if (isDeleted) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMINS CAN ACCESS
    public ResponseEntity<?> uploadTeacherFile(@RequestParam("type") String type,
                                               @RequestParam("id") Long id,
                                               @RequestParam("file") MultipartFile file,
                                               @RequestParam("aisha") String aishaCode) {
        try {
            boolean isUploaded = teacherService.uploadTeacherFile(type, id, file, aishaCode);
            if (isUploaded) {
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.UNPROCESSABLE_ENTITY);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/filter")
    // Anyone who is logged in (USER or ADMIN) can use the filter
    public List<TeacherDocument> getTeacherInfoByTypeAndAishaCode(@RequestParam String type, @RequestParam String aishaCode) {
        List<TeacherDocument> teacherInfo = teacherService.getTeacherInfoByTypeAndAishaCode(type, aishaCode);
        return teacherInfo;
    }
}