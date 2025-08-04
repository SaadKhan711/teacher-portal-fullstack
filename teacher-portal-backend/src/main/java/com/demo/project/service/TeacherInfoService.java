package com.demo.project.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.demo.project.entity.TeacherDocument;
import com.demo.project.enums.InstituteType;
import com.demo.project.vo.TeacherInfoVo;

public interface TeacherInfoService {

	public List<?> getAllteacherinfo(String type);
	public Long saveTeacherInfo(TeacherInfoVo teacher);
	boolean deleteTeacherInfo(String type, Long id);
	public boolean updateTeacherInfo(TeacherInfoVo teacher);
	boolean uploadTeacherFile(String type, Long id, MultipartFile file, String aishaCode);
	public List<TeacherDocument> getTeacherInfoByTypeAndAishaCode(String type, String aishaCode);;
	
}
