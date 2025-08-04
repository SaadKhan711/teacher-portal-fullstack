package com.demo.project.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "college_teacher_info")
public class CollegeTeacherInfo {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)

@Column(name = "id")
private Long id;

@Column(name = "name", length = 100)
private String name;

@Column(name = "telephone", length = 15)
private String telephone;

@Column(name = "mobile", length = 15)
private String mobile;

@Column(name = "email", length = 100)
private String email;

@Column(name = "address", length = 255)
private String address;

@Column(name = "city", length = 50)
private String city;

@Column(name = "state", length = 50)
private String state;

public Long getId() {
	return id;
}

public void setId(Long id) {
	this.id = id;
}

public String getName() {
	return name;
}

public void setName(String name) {
	this.name = name;
}

public String getTelephone() {
	return telephone;
}

public void setTelephone(String telephone) {
	this.telephone = telephone;
}

public String getMobile() {
	return mobile;
}

public void setMobile(String mobile) {
	this.mobile = mobile;
}

public String getEmail() {
	return email;
}

public void setEmail(String email) {
	this.email = email;
}

public String getAddress() {
	return address;
}

public void setAddress(String address) {
	this.address = address;
}

public String getCity() {
	return city;
}

public void setCity(String city) {
	this.city = city;
}

public String getState() {
	return state;
}

public void setState(String state) {
	this.state = state;
}


}


