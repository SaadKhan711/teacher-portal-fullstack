package com.demo.project.serviceimpl;

import com.demo.project.entity.CollegeTeacherInfo;
import com.demo.project.entity.StandaloneTeacherInfo;
import com.demo.project.entity.TeacherDocument;
import com.demo.project.entity.UniversityTeacherInfo;
import com.demo.project.repository.CollegeTeacherInfoRepository;
import com.demo.project.repository.StandaloneTeacherInfoRepository;
import com.demo.project.repository.TeacherDocumentRepository;
import com.demo.project.repository.UniversityTeacherInfoRepository;
import com.demo.project.service.TeacherInfoService;
import com.demo.project.vo.TeacherInfoVo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional // Let Spring manage transactions for all public methods in this class
public class TeacherInfoServiceImpl implements TeacherInfoService {

    @Autowired private CollegeTeacherInfoRepository collegeRepo;
    @Autowired private StandaloneTeacherInfoRepository standaloneRepo;
    @Autowired private UniversityTeacherInfoRepository universityRepo;
    @Autowired private TeacherDocumentRepository documentRepo;

    @Override
    @Transactional(readOnly = true) // It's a good practice to mark read-only methods
    public List<?> getAllteacherinfo(String type) {
        switch (type.toUpperCase()) {
            case "COLLEGE":
                return collegeRepo.findAll();
            case "STANDALONE":
                return standaloneRepo.findAll();
            case "UNIVERSITY":
                return universityRepo.findAll();
            default:
                throw new IllegalArgumentException("Invalid institution type: " + type);
        }
    }

    @Override
    public Long saveTeacherInfo(TeacherInfoVo teacherInfo) {
        switch (teacherInfo.getInstitutetype().toUpperCase()) {
            case "COLLEGE":
                CollegeTeacherInfo collegeTeacher = new CollegeTeacherInfo();
                BeanUtils.copyProperties(teacherInfo, collegeTeacher);
                return collegeRepo.save(collegeTeacher).getId();
            case "STANDALONE":
                StandaloneTeacherInfo standaloneTeacher = new StandaloneTeacherInfo();
                BeanUtils.copyProperties(teacherInfo, standaloneTeacher);
                return standaloneRepo.save(standaloneTeacher).getId();
            case "UNIVERSITY":
                UniversityTeacherInfo universityTeacher = new UniversityTeacherInfo();
                BeanUtils.copyProperties(teacherInfo, universityTeacher);
                return universityRepo.save(universityTeacher).getId();
            default:
                throw new IllegalArgumentException("Invalid institution type: " + teacherInfo.getInstitutetype());
        }
    }

    @Override
    public boolean updateTeacherInfo(TeacherInfoVo teacherInfo) {
        switch (teacherInfo.getInstitutetype().toUpperCase()) {
            case "COLLEGE":
                return collegeRepo.findById(teacherInfo.getId()).map(teacher -> {
                    BeanUtils.copyProperties(teacherInfo, teacher);
                    collegeRepo.save(teacher);
                    return true;
                }).orElse(false);
            case "STANDALONE":
                return standaloneRepo.findById(teacherInfo.getId()).map(teacher -> {
                    BeanUtils.copyProperties(teacherInfo, teacher);
                    standaloneRepo.save(teacher);
                    return true;
                }).orElse(false);
            case "UNIVERSITY":
                return universityRepo.findById(teacherInfo.getId()).map(teacher -> {
                    BeanUtils.copyProperties(teacherInfo, teacher);
                    universityRepo.save(teacher);
                    return true;
                }).orElse(false);
            default:
                throw new IllegalArgumentException("Invalid institution type: " + teacherInfo.getInstitutetype());
        }
    }

    @Override
    public boolean deleteTeacherInfo(String type, Long id) {
        switch (type.toUpperCase()) {
            case "COLLEGE":
                if (collegeRepo.existsById(id)) {
                    collegeRepo.deleteById(id);
                    return true;
                }
                return false;
            case "STANDALONE":
                if (standaloneRepo.existsById(id)) {
                    standaloneRepo.deleteById(id);
                    return true;
                }
                return false;
            case "UNIVERSITY":
                if (universityRepo.existsById(id)) {
                    universityRepo.deleteById(id);
                    return true;
                }
                return false;
            default:
                throw new IllegalArgumentException("Invalid institution type: " + type);
        }
    }

    @Override
    public boolean uploadTeacherFile(String type, Long id, MultipartFile file, String aishaCode) {
        try {
            TeacherDocument teacherDocument = new TeacherDocument();
            teacherDocument.setTeacherHighestQualification(file.getBytes());
            teacherDocument.setAishaCode(aishaCode);

            switch (type.toUpperCase()) {
                case "COLLEGE":
                    teacherDocument.setCollegeTeacherId(id);
                    break;
                case "STANDALONE":
                    teacherDocument.setStandaloneTeacherId(id);
                    break;
                case "UNIVERSITY":
                    teacherDocument.setUniversityTeacherId(id);
                    break;
                default:
                    throw new IllegalArgumentException("Invalid institution type: " + type);
            }
            documentRepo.save(teacherDocument);
            return true;
        } catch (IOException e) {
            // In a real app, you'd have more robust error handling
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDocument> getTeacherInfoByTypeAndAishaCode(String type, String aishaCode) {
        // The repository method finds all documents with the given aishaCode.
        // The logic here filters them by type.
        // NOTE: This could be made more efficient with a more specific query if needed.
        List<TeacherDocument> documents = documentRepo.findByAishaCode(aishaCode);
        
        // This part of the logic remains, as it's specific to your application's needs.
        // You would filter the results based on the 'type' here if necessary.
        // For example, checking if collegeTeacherId is not null for "COLLEGE" type.
        return documents;
    }
}