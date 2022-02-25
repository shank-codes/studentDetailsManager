const fs = require("fs");

const studentDAO = require("../DAO/studentDAO");
const imageService = require("../services/imageService");

exports.addStudent = async (studentDetails, imageId) => {
  try {
    let savedStudent = await studentDAO.addStudent({
      name: studentDetails.name,
      dob: studentDetails.dob,
      email: studentDetails.email,
      gender: studentDetails.gender,
      username: studentDetails.studentNumber,
      image: imageId,
    },studentDetails.password);
    return { success: true, student: savedStudent };
  } catch (err) {
    console.log(err);
    return { success: false, Error: err };
  }
};
exports.getStudents = async () => {
  try {
    let students = await studentDAO.getStudents();
    return { success: true, students: students.students };
  } catch (err) {
    return { success: false, Error: err };
  }
};

exports.getStudentById = async (studentId) => {
  try {
    let student = await studentDAO.getStudentById(studentId);
    return { success: true, student: student.student };
  } catch (err) {
    return { success: false, Error: err };
  }
};

exports.updateStudentAndImage = async (studentId, studentDetails,imageId) => {
  try {
    let updatedStudent = await studentDAO.updateStudent(
      studentId,
      {
        name: studentDetails.name,
        dob: studentDetails.dob,
        email:studentDetails.email,
        gender: studentDetails.gender,
        studentNumber: studentDetails.studentNumber,
        image: imageId
      }
    );
    return { success: true, student: updatedStudent.student };
  } catch (err) {
    return { success: false, Error: err };
  }
};

exports.deleteStudent = async (studentId) => {
  try {
    let student = await studentDAO.getStudentById(studentId);
    if (!student.success) {
      throw new Error("cannot get studen by id");
    }
    let deletedImage = await imageService.deleteImage(student.student.image);
    console.log(deletedImage)
    if (!deletedImage.success) {
      console.log('error here')
      throw new Error("cannot delete image");
    }
    console.log(deletedImage);

    let deletedStudent = await studentDAO.deleteStudent(studentId);
    if (!deletedStudent.success) throw new Error("cannot delete student");
    return { success: true, student: deletedStudent.student };
  } catch (err) {
    return { success: false, Error: err };
  }
};

exports.updateStudent = async (studentId, studentDetails) => {
  try {
    let updatedStudent = await studentDAO.updateStudent(
      studentId,
      studentDetails
    );
    return { success: true, student: updatedStudent.student };
  } catch (err) {
    return { success: false, Error: err };
  }
};